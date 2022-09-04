import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入dat.gui
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 后期效果合成器
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

// 框架自带效果
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
// 抗锯齿
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";

import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

// 2 ---  使用shader实现自定义合成效果，调节滤镜颜色
// 打造科技感效果

// 正交相机
// OrthographicCamera

const gui = new dat.GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 3);
scene.add(camera);

// 加载纹理

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/0/px.jpg",
  "textures/environmentMaps/0/nx.jpg",
  "textures/environmentMaps/0/py.jpg",
  "textures/environmentMaps/0/ny.jpg",
  "textures/environmentMaps/0/pz.jpg",
  "textures/environmentMaps/0/nz.jpg",
]);

scene.environment = envMapTexture;
scene.background = envMapTexture;
// 环境光
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

const directionLight = new THREE.DirectionalLight("#ffffff", 1);
// 光线允许投射阴影
directionLight.castShadow = true;
directionLight.position.set(0, 0, 200);
scene.add(directionLight);

// 模型加载
const gltfLoader = new GLTFLoader();
gltfLoader.load("./models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  console.log(gltf);
  // scene.add(gltf.scene)
  const mesh = gltf.scene.children[0];

  scene.add(mesh);
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染器允许接收阴影
renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;

// 合成效果
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// 1 ----------  添加黑色点粒子效果
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

// 2 ----------  抗锯齿
const smaaPass = new SMAAPass();
effectComposer.addPass(smaaPass);

// 3 ----------- 发光效果(骄阳似火)
const unrealBloomPass = new UnrealBloomPass();
effectComposer.addPass(unrealBloomPass);

// 4 ----------- 生化危机闪烁效果
// const glitchPass = new GlitchPass()
// effectComposer.addPass(glitchPass)

// 曝光程度
// 色调映射让场景看起来更加逼真，曝光程度，暗度显示，展现更多光亮细节
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

unrealBloomPass.strength = 1;
unrealBloomPass.radius = 0;
unrealBloomPass.threshold = 1;

gui.add(renderer, "toneMappingExposure").min(0).max(2).step(0.01);
gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.01);
gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.01);
gui.add(unrealBloomPass, "threshold").min(0).max(2).step(0.01);

const colorParams = {
  r: 0,
  g: 0,
  b: 0,
};

// 着色器写渲染通道
const shaderPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uColor: {
      value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b),
    },
  },
  vertexShader: `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
  }
  `,
  // 获取当前页面样式的纹理 sampler2D
  fragmentShader: `
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform vec3 uColor;
  void main(){
    vec4 color = texture2D(tDiffuse,vUv);
    color.xyz += uColor;
    // gl_FragColor = vec4(vUv,0.0,1.0);
    // color.r+=0.2;
    // color.g+=0.3;
    // color.b+=0.5;
    gl_FragColor = color;
  }
  `,
});

effectComposer.addPass(shaderPass);

gui
  .add(colorParams, "r")
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderPass.uniforms.uColor.value.r = value;
  });
gui
  .add(colorParams, "g")
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderPass.uniforms.uColor.value.g = value;
  });
gui
  .add(colorParams, "b")
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderPass.uniforms.uColor.value.b = value;
  });

// 有科技感的合成效果
const normalTexture = textureLoader.load("./textures/interfaceNormalMap.png");

// 根据法线纹理进行取样
const techPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uNormalMap:{
      value:null
    }
  },
  vertexShader: `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
  }
  `,
  // 获取当前页面样式的纹理 sampler2D
  fragmentShader: `
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform sampler2D uNormalMap;
  void main(){
    vec4 color = texture2D(tDiffuse,vUv);
    // 法线纹理 -- 对光线折射
    vec4 normalColor = texture2D(uNormalMap,vUv);
    // 设置光线入射角度 -- normalize变成单位向量
    vec3 lightDirection = normalize(vec3(-5,5,2));
    // dot点集, 除去alpha,只取xyz,光线方向;前置函数(设置范围,小于0为0,大于1为1)
    float lightness =clamp(dot(normalColor.xyz,lightDirection),0.0,1.0);
    color.xyz += lightness;
    gl_FragColor = color;
  }
  `,
});

techPass.material.uniforms.uNormalMap.value = normalTexture
effectComposer.addPass(techPass)

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
const clock = new THREE.Clock();

// 动画循环
function render() {
  controls.update();
  let elapsedTime = clock.getElapsedTime();
  // 使用渲染器渲染相机
  // renderer.render(scene, camera);
  effectComposer.render();
  // 下一帧执行函数
  requestAnimationFrame(render);
}
render();

// 监听画面变化，更新渲染页面
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

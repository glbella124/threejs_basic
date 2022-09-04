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
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';

// 框架自带效果
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass';
// 抗锯齿
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass'
import {SSAARenderPass} from 'three/examples/jsm/postprocessing/SSAARenderPass'

import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'

// 1 ----  简单合成效果
// 点粒子效果，抗锯齿，屏幕闪烁效果

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

camera.position.set(0, 0, 10);
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
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth,window.innerHeight)

// 添加渲染通道
const renderPass = new RenderPass(scene,camera)
effectComposer.addPass(renderPass)

// 1 ----------  添加黑色点粒子效果
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// 2 ----------  抗锯齿
const smaaPass = new SMAAPass()
effectComposer.addPass(smaaPass)

// 3 ----------- 发光效果(骄阳似火)
const unrealBloomPass = new UnrealBloomPass()
effectComposer.addPass(unrealBloomPass)

// 4 ----------- 生化危机闪烁效果
const glitchPass = new GlitchPass()
effectComposer.addPass(glitchPass)


// 曝光程度
// 色调映射让场景看起来更加逼真，曝光程度，暗度显示，展现更多光亮细节
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

unrealBloomPass.strength = 1
unrealBloomPass.radius = 0
unrealBloomPass.threshold = 1

gui.add(renderer,"toneMappingExposure").min(0).max(2).step(0.01)
gui.add(unrealBloomPass,"strength").min(0).max(2).step(0.01)
gui.add(unrealBloomPass,"radius").min(0).max(2).step(0.01)
gui.add(unrealBloomPass,"threshold").min(0).max(2).step(0.01)

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
  effectComposer.render()
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

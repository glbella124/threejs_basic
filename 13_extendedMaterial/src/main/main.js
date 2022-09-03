import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入dat.gui
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

// 修改物理光照材质 -- 模拟人物被打效果

// 正交相机
// OrthographicCamera

// const gui = new dat.GUI();
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


// 环境光
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);


const directionLight = new THREE.DirectionalLight("#ffffff",1)
// 光线允许投射阴影
directionLight.castShadow = true
directionLight.position.set(0,0,200)
scene.add(directionLight)

scene.environment = envMapTexture;
scene.background = envMapTexture;


// 加载模型纹理
const modelTexture = textureLoader.load('./models/LeePerrySmith/color.jpg');
// 加载模型的法向纹理
const normalTexture = textureLoader.load('./models/LeePerrySmith/normal.jpg')


const material = new THREE.MeshStandardMaterial({
  map:modelTexture,
  normalMap:normalTexture
})

const customUniforms = {
  uTime:{
    value:0
  }
}

material.onBeforeCompile = (shader) =>{
  console.log(shader.vertexShader);
  console.log(shader.fragmentShader);
  // 传递时间
  shader.uniforms.uTime = customUniforms.uTime

  // 声明旋转函数
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )

  // 修改法线 -- 调整光线
  shader.vertexShader = shader.vertexShader.replace(
    `#include <beginnormal_vertex>`,
    `
    #include <beginnormal_vertex>
    float angle = sin(position.y+uTime)*0.3;
    mat2 rotateMatrix = rotate2d(angle);
    objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
 )

  // 开始顶点
  shader.vertexShader = shader.vertexShader.replace(
     `#include <begin_vertex>`,
     `
     #include <begin_vertex>
    //  float angle = transformed.y*0.3;
    //  mat2 rotateMatrix = rotate2d(angle);
     transformed.xz = rotateMatrix * transformed.xz;
     `
  )

}

// 按深度绘制几何体的材质，深度基于相机远近，白色最近，黑色最远
const depthMaterial = new THREE.MeshDepthMaterial({
  // 编码
  depthPacking:THREE.RGBADepthPacking
})

// 材质旋转，深度材质也需要旋转
depthMaterial.onBeforeCompile = (shader) =>{
  console.log(shader.vertexShader);
  console.log(shader.fragmentShader);

  // 声明旋转函数
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )

  // 开始顶点
  shader.vertexShader = shader.vertexShader.replace(
     `#include <begin_vertex>`,
     `
     #include <begin_vertex>
     float angle = sin(transformed.y+uTime)*0.2;
     mat2 rotateMatrix = rotate2d(angle);
     transformed.xz = rotateMatrix * transformed.xz;
     `
  )

}

// 模型加载
const gltfLoader = new GLTFLoader();
gltfLoader.load('./models/LeePerrySmith/LeePerrySmith.glb',(gltf)=>{
  const mesh = gltf.scene.children[0]
  mesh.material = material;
  // 物体允许投射阴影
  mesh.castShadow = true;
  // 若修改了顶点着色器中的顶点位置，则必须指定customDepthMaterial以获得正确的阴影，默认为未定义
  mesh.customDepthMaterial = depthMaterial
  scene.add(mesh)
  
})


const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20,20),
  new THREE.MeshStandardMaterial()
)
plane.position.set(0,0,-6);
// 平面允许接收阴影
plane.receiveShadow = true;
scene.add(plane)



// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染器允许接收阴影
renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;
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
  customUniforms.uTime.value = elapsedTime
  renderer.render(scene, camera);
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

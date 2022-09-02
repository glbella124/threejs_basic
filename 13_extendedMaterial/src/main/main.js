import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入dat.gui
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 加工着色器材质
// three框架原理与应用

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


let basicMaterial = new THREE.MeshBasicMaterial({
  color:"#00ff00",
  side:THREE.DoubleSide
});

const basicUniform = {
  uTime:{
    value:0
  }
}

// 编译之前
basicMaterial.onBeforeCompile = (shader,renderer) =>{
  console.log(shader);
  console.log(shader.vertexShader);
  console.log(shader.fragmentShader);
  // 允许修改源码中默认的着色器配置
  shader.uniforms.uTime = basicUniform.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    uniform float uTime;
    `
  )
  // 改变顶点位置
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
    transformed.x +=sin(uTime)*2.0;
    transformed.z +=cos(uTime)*2.0;
    `
  )
}



let standardMaterial = new THREE.MeshStandardMaterial({
  color:"#ffff00"
})


// 创建平面
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(2,2),
  basicMaterial
)
scene.add(floor)

// 环境光 soft white light - 四面八方打过来的光
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);



// 点光源
const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);
// 设置光照投射阴影
pointLight.castShadow = true;

// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图分辨率 - 阴影更加细致
pointLight.shadow.mapSize.set(512, 512);
pointLight.decay = 0;


// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const clock = new THREE.Clock();

// 动画循环
function render() {
  let elapsedTime = clock.getElapsedTime();
  basicUniform.uTime.value = elapsedTime
  controls.update();
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

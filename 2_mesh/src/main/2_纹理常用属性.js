import * as THREE from "three";
import { BoxBufferGeometry, WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

// 纹理常用属性

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

// 导入纹理
const textLoader = new THREE.TextureLoader();
const doorColorTexture = textLoader.load("./textures/door/color.jpg");

// 纹理偏移设置
// doorColorTexture.offset.x = 0.5
// doorColorTexture.offset.set(0.5,0.5)

// 设置旋转原点
// doorColorTexture.center.set(0.5, 0.5);
// 纹理旋转 - 左下角原点，逆时针旋转
// doorColorTexture.rotation = Math.PI / 4;
// 设置纹理重复
// .wrapS -- 该值定义了纹理贴图在水平方向上如何包裹
// .wrapT -- 垂直方向上如何包裹
// http://www.webgl3d.cn/threejs/docs/?q=texture#api/zh/constants/Textures
doorColorTexture.repeat.set(2,3)
// 设置纹理重复模式 - 无线重复 - 垂直
doorColorTexture.wrapT = THREE.RepeatWrapping
// 镜像重复 - 水平
doorColorTexture.wrapS = THREE.MirroredRepeatWrapping



// 基础网格材质
const cubeGeomeotry = new THREE.BoxBufferGeometry(1, 1, 1);
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  // 颜色贴图
  map: doorColorTexture,
});
const cube = new THREE.Mesh(cubeGeomeotry, basicMaterial);
scene.add(cube);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 动画循环
function render() {
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

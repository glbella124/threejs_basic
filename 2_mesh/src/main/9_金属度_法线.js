import * as THREE from "three";
import { BoxBufferGeometry, WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

// 金属度与金属贴图
// 光朝向不一样，反射不一样
// 法线贴图 - 法线（决定了点对应面的切线的朝向，点如何反射光，使得物体质感更加逼真）

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

// .alphaMap : Texture
// alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。
// （黑色：完全透明；白色：完全不透明）。 默认值为null。
const doorAlphaTexture = textLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textLoader.load("./textures/door/ambientOcclusion.jpg");
// 导入置换贴图
const doorHeightTexture = textLoader.load("./textures/door/height.jpg");
// 导入粗糙度贴图
const doorRoughTexture = textLoader.load("./textures/door/roughness.jpg")
// 导入金属贴图
const doorMetalTexture = textLoader.load("./textures/door/metalness.jpg")
// 导入发现贴图
const normalTexture = textLoader.load("./textures/door/normal.jpg")
const cubeGeomeotry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);

// 标准材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  // 颜色贴图
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  displacementMap: doorHeightTexture,
  // 凸出程度，最大凸出5公分
  displacementScale: 0.1,
  // 粗糙度和粗糙度纹理二者相乘
  roughness:1,
  roughnessMap:doorRoughTexture,
  metalness:1,
  metalnessMap:doorMetalTexture,
  // 法线贴图
  normalMap:normalTexture
});
const cube = new THREE.Mesh(cubeGeomeotry, material);
scene.add(cube);

// 给cube添加第二组uv
// 增强了立体感
cubeGeomeotry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeomeotry.attributes.uv.array, 2)
);

// 添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(1.5, 0, 0);
scene.add(plane);

// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

// 环境光 soft white light - 四面八方打过来的光
const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light);

// 直线光源 - 平行光源
const directionLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionLight.position.set(10, 10, 10);
scene.add(directionLight);

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

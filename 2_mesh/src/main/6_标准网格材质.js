import * as THREE from "three";
import { BoxBufferGeometry, WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";


// 标准网格材质与光照物理效果
// 需要有灯光 - 反射

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

// 基础网格材质
const cubeGeomeotry = new THREE.BoxBufferGeometry(1, 1, 1);

// 标准材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  // 颜色贴图
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  // opacity:0.9,
  side: THREE.DoubleSide,
  aoMap: doorAoTexture,
  aoMapIntensity:0.5
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
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(1.5, 0, 0);
scene.add(plane);

// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);


// 环境光 soft white light - 四面八方打过来的光
const light = new THREE.AmbientLight(0xffffff,0.7)
scene.add(light)

// 直线光源 - 平行光源
const directionLight = new THREE.DirectionalLight(0xffffff,0.8) 
directionLight.position.set(10,10,10)
scene.add(directionLight)

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

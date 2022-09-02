import * as THREE from "three";
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  OrthographicCamera,
  WebGLBufferRenderer,
} from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入dat.gui
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// points - 星空

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

// 粒子效果，参考三角面片
// 是面片、线或点几何体的有效表述
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
// 设置缓冲区数组
const positions = new Float32Array(count * 3);
// 设置粒子顶点颜色
const colors = new Float32Array(count * 3);
// 设置顶点
for (let i = 0; i < count * 3; i++) {
  // positions[i] = Math.random() * 10 - 5;
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random()
}

// 利用 BufferAttribute，可以更高效的向GPU传递数据
// setAttribute - 为当前几何体设置一个attribute属性
// 在类的内部，有一个存储 .attributes 的 hashmap，
// 通过该 hashmap，遍历 attributes 的速度会更快。
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors,3)
)

const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.8;
// pointsMaterial.color.set(0xcc00ff);
pointsMaterial.color.set(0xfff000);
// 相机深度衰减
pointsMaterial.sizeAttenuation = true;

// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/particles/1.png");
// 设置点纹理
pointsMaterial.map = texture;
pointsMaterial.alphaMap = texture;
pointsMaterial.transparent = true;
// 渲染此材质是否对深度缓冲区有任何影响
// 深度检测，物体被挡住以后不再计算
pointsMaterial.depthWrite = false;
// 叠加算法 - 物体重叠时效果增强
pointsMaterial.blending = THREE.AdditiveBlending;
// 设置启动顶点颜色
pointsMaterial.vertexColors = true


const points = new THREE.Points(particlesGeometry, pointsMaterial);

scene.add(points);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
const clock = new THREE.Clock();

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

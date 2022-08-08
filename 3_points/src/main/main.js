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

// 特定形状的星系 -- 臂旋星系

const scene = new THREE.Scene();

// 更改参数值允许只看到下降
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  30
  // 1000
);

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./textures/particles/1.png");

camera.position.set(0, 0, 10);
scene.add(camera);

// 随机生成一条直线
// 从中心到尾部渐变色
const params = {
  // 点多以后效果更好
  count: 10000,
  size: 0.1,
  radius: 5,
  branch: 9,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};

let geometry = null;
let material = null;
let points = null;
const centerColor = new THREE.Color(params.color);
const endColor = new THREE.Color(params.endColor);

const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  // 随机生成位置
  const positions = new Float32Array(params.count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3);

  // 循环生成顶点
  for (let i = 0; i < params.count; i++) {
    // 三个分支
    // 求余决定在哪条分支上 - 决定角度
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);

    // 效果1 - 当前点距离圆心的距离
    // const distance = Math.random() * params.radius;

    // 效果2 - 越往边沿越来越小- 范围(0,1)Math.pow(Math.random(), 3)
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);

    const current = i * 3;

    // 效果1：使得点随机散开
    // 三次方 - 中间聚拢，两边分散的效果
    // const randomX = Math.pow(Math.random() * 2 - 1, 3);
    // const randomY = Math.pow(Math.random() * 2 - 1, 3);
    // const randomZ = Math.pow(Math.random() * 2 - 1, 3);

    // 效果2：和当前距离圆心的距离有关
    // 距离越近随机范围越大 - 中间集中，两边分散,比效果1好些
    // const randomX = Math.pow(Math.random() * 2 - 1, 3) * distance/5;
    // const randomY = Math.pow(Math.random() * 2 - 1, 3) * distance/5;
    // const randomZ = Math.pow(Math.random() * 2 - 1, 3) * distance/5;

    // 效果3分布较为均匀
    // const randomZ = Math.random();
    // const randomX = Math.random();
    // const randomY = Math.random();

    // 效果4 - 由中间均匀分散到尾巴
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

    // 当前点的位置 - 控制弯曲程度 params.rotateScale
    positions[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    positions[current + 1] = 0 + randomY;
    // 控制弯曲的角度
    positions[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;

    // 混合颜色，形成渐变色
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.color),
    size: params.size,
    // 远近距离大小不一样 - 相机深度衰减
    sizeAttenuation: true,
    // 深度检测，物体被挡住以后不再计算
    depthWrite: false,
    // 效果叠加增强
    blending: THREE.AdditiveBlending,
    map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
    // 顶点颜色
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

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
  controls.update();
  renderer.render(scene, camera);
  // 下一帧执行函数
  requestAnimationFrame(render);
}
render();

// 监听画面变化，更新渲染页面
window.addEventListener("resize", () => {
  let time = clock.getElapsedTime();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

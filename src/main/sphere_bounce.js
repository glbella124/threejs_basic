import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入帧率统计包
import Stats from "three/examples/js/libs/stats.min.js";

// 导入动画库
import gsap from "gsap";

// 导入dat.gui库 - 轻量级UI界面控制库
import * as dat from "dat.gui";

// 保存希望被GUI改变的属性
let controls = {
  rotationSpeed: 0.02, // 旋转速度
  bouncingSpeed: 0.03, // 弹跳速度
};

// 实例化GUI
const gui = new dat.GUI();
gui.add(controls, "rotationSpeed", 0, 0.5, 0.01).name("旋转速度");
gui.add(controls, "bouncingSpeed", 0, 0.5, 0.01).name("弹跳速度");

function initStats(type) {
  var panelType =
    typeof type !== "undefined" && type && !isNaN(type) ? parseInt(type) : 0;
  var stats = new Stats();
  stats.showPanel(panelType);
  document.body.appendChild(stats.dom);
  return stats;
}

const stats = initStats();

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 定义渲染器
const renderer = new THREE.WebGLRenderer();
// 定义场景的颜色为黑色
renderer.setClearColor(0x000000);
// 定义场景大小为整个窗口
renderer.setSize(window.innerWidth, window.innerHeight);
// 启动渲染阴影效果
renderer.shadowMap.enabled = true;
// 创建一个粗细为20的坐标轴
const axes = new THREE.AxesHelper(20);
scene.add(axes);

// 添加光源
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 40, -15);
spotLight.castShadow = true;
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
spotLight.shadow.camera.far = 130;
spotLight.shadow.camera.near = 40;
scene.add(spotLight);

// 创建一个宽为60，高为20的的平面。
const planeGeometry = new THREE.PlaneGeometry(60, 20);
// 设置平面的材质
const planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});

// 赋值到Mesh
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// 设置平面位置和旋转
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
// 设置地面为投影面
plane.receiveShadow = true;
// 将平面添加到场景中
scene.add(plane);

// 创建一个立方体
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-4, 3, 0);
// 开启投影
cube.castShadow = true;
scene.add(cube);

// 创建一个球体
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x7777ff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(20, 4, 2);
// 开启投影
sphere.castShadow = true;
scene.add(sphere);

// 设置摄像机的位置
camera.position.set(-30, 40, 30);
// 摄像机指向场景中心
camera.lookAt(scene.position);
// 将渲染的结果加入到div中
document.body.appendChild(renderer.domElement);
// document.querySelector('#webgl-box').appendChild(renderer.domElement)
// 创建轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼(惯性)，这将给控制器带来重量感
orbitControls.enableDamping = true;

// 实现鼠标移动摄像头
const trackballControls = new TrackballControls(camera, renderer.domElement);

window.addEventListener("dblclick", () => {
  // 双击进入全屏，退出全屏
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// 方案一： 由clock控制
// 帧率动画
const clock = new THREE.Clock();
let step = 0; // 定义小球弹跳速度
// // 动画循环
function render() {
  // 跟新帧率控件的展示
  stats.update();
  trackballControls.update(clock);
  orbitControls.update();
  // 定义立方体的动画
  cube.rotation.x += controls.rotationSpeed;
  cube.rotation.y += controls.rotationSpeed;
  cube.rotation.z += controls.rotationSpeed;

  // 定义小球的弹跳动画
  step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * Math.cos(step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
  console.log(sphere.position.x,"x");
  console.log(sphere.position.y,"y");
  renderer.render(scene, camera);
  // 下一帧执行函数
  requestAnimationFrame(render);
}

// 方案二：引入gsap库动画 - 效果不如方案一
// gsap.to(cube.rotation, {
//   x: 2 * Math.PI,
//   duration: 3,
//   ease: "power1.inOut",
//   repeat: -1,
// });
// gsap.to(cube.rotation, {
//   y: 2 * Math.PI,
//   duration: 3,
//   ease: "power1.inOut",
//   repeat: -1,
// });
// gsap.to(cube.rotation, {
//   z: 2 * Math.PI,
//   duration: 3,
//   ease: "power1.inOut",
//   repeat: -1,
// });

// gsap.to(sphere.position, {
//   x: 20 + 10 * Math.cos(0.5),
//   duration: 3,
//   ease: "power1.inOut",
//   repeat: -1,
//   yoyo: true,
// });

// gsap.to(sphere.position, {
//   y: 2 + 10 * Math.abs(Math.sin(0.5)),
//   duration: 3,
//   ease: "power1.inOut",
//   repeat: -1,
//   yoyo: true,
// });
// // 动画循环
// function render() {
//   orbitControls.update();
//   renderer.render(scene, camera);
//   // 下一帧执行函数
//   requestAnimationFrame(render);
// }

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

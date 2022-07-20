import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入动画库
import gsap from "gsap";

// 导入dat.gui库 - 轻量级UI界面控制库
import * as dat from "dat.gui";
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 10);
// cube.position.x = 1
scene.add(camera);

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 修改物体的位置
cube.position.set(0, 0, 0);
console.log(cube);

// 缩放
cube.scale.set(1, 1, 1);

// 旋转
// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");

scene.add(cube);

// 界面控制器
const gui = new dat.GUI();
gui.add(cube.position, "x").min(0).max(5).step(0.01).name("移动x轴");

const params = {
  color: "#ffff00",
  fn: () => {
    // 让立方体运动起来
    gsap.to(cube.position, { x: 5, duration: 2, yoyo:true, repeat:-1 });
  },
};
// 修改物体的颜色
gui.addColor(params, "color").onChange((value) => {
  console.log("当前修改的颜色", value);
  cube.material.color.set(value);
});


var folder = gui.addFolder("设置立方体")
folder.add(cube.material,"wireframe")
// 设置选项框
folder.add(cube, "visible").name("是否显示");
// 设置按钮点击触发某个事件
folder.add(params,"fn").name("点击使立方体运动")

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 使用渲染器，通过相机将场景渲染进来
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼(惯性)，这将给控制器带来重量感
controls.enableDamping = true;

// 添加坐标轴
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

window.addEventListener("dblclick", () => {
  // 双击进入全屏，退出全屏
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// 动画循环
function render() {
  controls.update();
  renderer.render(scene, camera);
  // 下一帧执行函数
  requestAnimationFrame(render);
}
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

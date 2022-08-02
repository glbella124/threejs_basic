import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  color: 0xffff00,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 修改物体的位置
cube.position.set(0, 0, 0);
console.log(cube);

// 缩放
cube.scale.set(1, 1, 1);

// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");

scene.add(cube);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 使用渲染器，通过相机将场景渲染进来
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标轴
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render(time) {
  let t = (time / 1000) % 5;
  cube.position.x = t * 1;
  cube.scale.y = t * 1;
  cube.scale.z = t * 1;
  cube.rotation.x = t * 1;

  if (cube.position.x > 5) {
    cube.position.x = 0;
  }

  if (cube.position.x === 0) {
    cube.scale.set(1, 1, 1);
    cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");
  }

  renderer.render(scene, camera);
  // 下一帧执行函数
  requestAnimationFrame(render);
}
render();

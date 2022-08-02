import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

// BufferGeometry
// 三角面片动画

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

for (let i = 0; i < 50; i++) {
  // 每个三角形需要三个顶点，每个顶点需要三个值
  const geometry = new THREE.BufferGeometry();
  const position = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    position[j] = Math.random() * 10 - 5;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.7,
  });

  const mesh = new THREE.Mesh(geometry, material);
  console.log(mesh);
  scene.add(mesh);
}

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
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
});

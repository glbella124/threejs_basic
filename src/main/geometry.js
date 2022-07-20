import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入动画库
import gsap from "gsap";

// 导入dat.gui库 - 轻量级UI界面控制库
import * as dat from "dat.gui";

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight/window.innerHeight,
  0.1,
  1000
)

camera.position.set(0,0,10)
scene.add(camera)

const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set(0,0,0)

console.log(cube);

scene.add(cube);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)


const controls = new OrbitControls(camera,renderer.domElement)
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 动画循环
function render() {
  controls.update();
  renderer.render(scene, camera);
  // 下一帧执行函数
  requestAnimationFrame(render);
}
render();





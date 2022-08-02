import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";


// BufferGeometry
// 三角面片动画 

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight/window.innerHeight,
  0.1,
  1000
)

camera.position.set(0,0,10)
scene.add(camera)

const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
  -1.0,-1.0,1.0,
  1.0,1.0,1.0,
  -1.0,1.0,1.0,

  -1.0,-1.0,1.0,
  1.0,-1.0,1.0,
  1.0,1.0,1.0

])

geometry.setAttribute("position", new THREE.BufferAttribute(vertices,3))
const material = new THREE.MeshBasicMaterial({
  color:0xff0000
})

const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)


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





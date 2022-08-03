import * as THREE from "three";
import { BoxBufferGeometry, WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

// 纹理显示算法

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

const texture = textLoader.load("./textures/minecraft.png")

// 纹理显示设置
// texture.minFilter = THREE.NearestFilter
// texture.magFilter = THREE.NearestFilter
// 选择与被纹理化像素的尺寸最匹配的mipmap， 
// 并以LinearFilter（最靠近像素中心的四个纹理元素的加权平均值）为标准来生成纹理值。
texture.minFilter = THREE.LinearMipmapLinearFilter
texture.magFilter = THREE.LinearFilter

// 基础网格材质
const cubeGeomeotry = new THREE.BoxBufferGeometry(1, 1, 1);
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  // 颜色贴图
  // map: doorColorTexture,
  map:texture
});
const cube = new THREE.Mesh(cubeGeomeotry, basicMaterial);
scene.add(cube);

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

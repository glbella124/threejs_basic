import * as THREE from "three";
import {
  BoxBufferGeometry,
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

// 灯光与阴影
// 1. 选择对光照有反应的材质 eg. THREE.MeshStandardMaterial
// 2. 渲染器开启阴影计算 renderer.shadowMap.enabled = true
// 3. 设置光照投射阴影 directionLight.cashShadow = true
// 4. 设置物体投射阴影 directionLight.castShadow = true
// 5. 设置物体接收阴影 plane.receiveShadow = true
// 缺一不可

// 阴影属性
// DirectionLightShadow()

// 正交相机
// OrthographicCamera

const gui = new dat.GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();

const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;
scene.add(sphere);

// 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
scene.add(plane);

// 环境光 soft white light - 四面八方打过来的光
const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light);

// 直线光源 - 平行光源
const directionLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionLight.position.set(5, 5, 5);
// 设置光照投射阴影
directionLight.castShadow = true;

// 设置阴影贴图模糊度
directionLight.shadow.radius = 20;
// 设置阴影贴图分辨率 - 阴影更加细致
directionLight.shadow.mapSize.set(4096, 4096);

// 设置平行光投射相机的属性
// 平行光射向物体时需要计算范围， 在一个长方体范围内
directionLight.shadow.camera.near = 0.5;
directionLight.shadow.camera.far = 500;
// 平面的范围
directionLight.shadow.camera.top = 5;
directionLight.shadow.camera.bottom = -5;
directionLight.shadow.camera.left = -5;
directionLight.shadow.camera.right = 5;

scene.add(directionLight);

// 控制变量
gui
  .add(directionLight.shadow.camera, "near")
  .min(0)
  .max(10)
  .step(0.1)
  .onChange(() => {
    directionLight.shadow.camera.updateProjectionMatrix()
  });

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
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

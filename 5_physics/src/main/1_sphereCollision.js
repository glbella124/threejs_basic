import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
// 导入cannon引擎
import * as CANNON from "cannon-es";

//  1 ------------- 球体掉落地面的物理特效

// 使用cannon物理引擎
// cannon-es

// https://pmndrs.github.io/cannon-es/

// 文档：

// https://schteppe.github.io/cannon.js/docs/

const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// 设置相机位置
camera.position.set(0, 0, 18);
scene.add(camera);

// 创建球和平面
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);

const planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(planeGeometry, planeMaterial);
floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 创建物理世界
// const world = new CANNON.World({gravity:9.8});
const world = new CANNON.World();
// -9.8 方向向下
world.gravity.set(0, -9.8, 0);
// 创建物理小球形状
const sphereShape = new CANNON.Sphere(1);
// 设置物体材质
const sphereWorldMaterial = new CANNON.Material("sphere");

// 创建物理世界的物体
const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, 0, 0),
  // 小球质量
  mass: 1,
  // 物体材质
  material: sphereWorldMaterial,
});

// 将物体添加至物理世界
world.addBody(sphereBody);

// 创建击打声音
// aigei
const hitSound = new Audio("assets/metalHit.mp3");

// 添加监听碰撞事件
function HitEvent(e) {
  // console.log("hit", e);
  // 获取碰撞的强度
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  // 页面先有交互才会触发声音播放
  console.log(impactStrength);
  if (impactStrength > 2) {
    // 重新从零开始播放
    hitSound.currentTime = 0;
    hitSound.play();
  }
}
sphereBody.addEventListener("collide", HitEvent);

// 物理世界创建地面
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
const floorMaterial = new CANNON.Material("floor");
floorBody.material = floorMaterial;
// 当质量为0的时候，物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
// 地面位置
floorBody.position.set(0, -5, 0);
// 旋转地面 - 碰撞后落到地面上了
// https://schteppe.github.io/cannon.js/docs/classes/Quaternion.html
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

//设置两种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  sphereMaterial,
  floorMaterial,
  {
    // 摩擦力
    friction: 0.1,
    // 弹性
    restitution: 0.7,
  }
);

// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);

// 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionLight.position.set(5, 5, 5);
directionLight.castShadow = true;
scene.add(directionLight);

// 初始化渲染器
// 渲染器透明
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// 坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock();

function render() {
  let deltaTime = clock.getDelta();
  // 更新物理引擎世界的物体
  world.step(1 / 120, deltaTime);
  sphere.position.copy(sphereBody.position);

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

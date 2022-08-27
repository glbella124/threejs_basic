import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 顶点着色器
import vertexShader from "../shader/lantern/vertex.glsl";
// 片元着色器
import fragmentShader from "../shader/lantern/fragment.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 制作孔明灯

//创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 20);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 查看3维坐标轴的辅助轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 创建纹理加载器对象
const rgbeLoader = new RGBELoader();
// 异步加载
rgbeLoader.loadAsync("./assets/2k_sky.hdr").then((texture) => {
  // 纹理映射方式 -- 圆柱投影 - 不设置场景无效
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

let params = {};

// 创建平面
// const material = new THREE.MeshBasicMaterial({ color: "#00ff00" });
// 改用着色器材质
// shaderMaterial -- 自动添加一些着色器的属性
const shaderMaterial = new THREE.ShaderMaterial({
  // 变换坐标矩阵
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  // wireframe:true
  side: THREE.DoubleSide,
  uniforms: {},
});

// 改善曝光程度
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// 定义渲染器输出编码
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMapping  = THREE.ReinhardToneMapping
// renderer.toneMapping  = THREE.CineonToneMapping
renderer.toneMappingExposure = 0.2;

let lantern = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/model/lantern.glb", (gltf) => {
  //   scene.add(gltf.scene);
  console.log(gltf);
  lantern = gltf.scene.children[0];
  lantern.material = shaderMaterial;

  for (let i = 0; i < 150; i++) {
    let lanternObj = gltf.scene.clone(true);
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 25;
    lanternObj.position.set(x, y, z);
    gsap.to(lanternObj.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    });
    gsap.to(lanternObj.position, {
      x: "+=" + Math.random() * 5,
      y: "+=" + Math.random() * 20,
      // 来回进行运动
      yoyo: true,
      // 允许向下运动
      repeat: -1,
      duration: 5 + Math.random() * 10,
    });
    scene.add(lanternObj);
  }
});

// 色调映射
// 在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围(HDR)效果
// https://www.yuque.com/books/share/aa187c93-6603-453e-9377-9a935b59aeb4/pdvccm

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

//初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
// 垂直旋转的角度的上限(0~Math.PI)
controls.maxPolarAngle = Math.PI/4*3;
// 允许垂直旋转的角度的下限(0~Math.PI)
controls.minPolarAngle = Math.PI/4*3

const clock = new THREE.Clock();

function animate() {
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

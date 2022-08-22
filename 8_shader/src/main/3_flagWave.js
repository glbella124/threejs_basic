import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 顶点着色器
import rawVertexShader from "../shader/raw/vertex.glsl";
// 片元着色器
import rawFragmentShader from "../shader/raw/fragment.glsl";

// 原始着色器 -- 不会自动补充一些着色器属性
// 旗子舞动效果
// 颜色渐变效果

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
camera.position.set(0, 0, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./texture/ca.jpeg");

const params = {
  uFrequency: 10,
  uScale: 0.1,
};

// 创建平面
// const material = new THREE.MeshBasicMaterial({ color: "#00ff00" });
// 改用着色器材质
// rawShaderMaterial ---  原始着色器
const rawShaderMaterial = new THREE.RawShaderMaterial({
  // 变换坐标矩阵
  vertexShader: rawVertexShader,
  fragmentShader: rawFragmentShader,
  // wireframe:true
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
  },
});

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 64, 64),
  rawShaderMaterial
);
scene.add(floor);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
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

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  rawShaderMaterial.uniforms.uTime.value = elapsedTime;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

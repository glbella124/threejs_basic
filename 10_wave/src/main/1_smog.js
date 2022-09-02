import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 顶点着色器
import vertexShader from "../shader/basic/vertex.glsl";
// 片元着色器
import fragmentShader from "../shader/basic/fragment.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 制作可控制的波浪，烟雾效果

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
camera.position.set(0, 1, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 查看3维坐标轴的辅助轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const params = {
  uWaveFrequency: 14,
  uScale: 0.03,
  uXzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 0.737,
  uLowColor: "#a400ff",
  uHighColor: "#ffb400",
  uXspeed:1,
  uZspeed:1,
  // 噪声波纹速度
  uNoiseSpeed:1,
  uOpacity:1
};

// shaderMaterial -- 补充材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uWaveFrequency: {
      value: params.uWaveFrequency,
    },
    uScale: {
      value: params.uScale,
    },
    uXzScale: {
      value: params.uXzScale,
    },
    uNoiseFrequency: {
      value: params.uNoiseFrequency,
    },
    uNoiseScale: {
      value: params.uNoiseScale,
    },
    uTime: {
      value: params.uTime,
    },
    uLowColor: {
      value: new THREE.Color(params.uLowColor),
    },
    uHighColor: {
      value: new THREE.Color(params.uHighColor),
    },
    uXspeed: {
      value: params.uXspeed,
    },
    uZspeed: {
      value: params.uZspeed,
    },
    uNoiseSpeed: {
      value: params.uNoiseSpeed,
    },
    uOpacity: {
      value: params.uOpacity,
    },
  },
  transparent: true,
});

gui
  .add(params, "uWaveFrequency")
  .min(1)
  .max(100)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uWaveFrequency.value = value;
  });

gui
  .add(params, "uScale")
  .min(0)
  .max(0.2)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uScale.value = value;
  });

gui
  .add(params, "uXzScale")
  .min(1)
  .max(10)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uXzScale.value = value;
  });

gui
  .add(params, "uNoiseFrequency")
  .min(0)
  .max(50)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value;
  });

gui
  .add(params, "uNoiseScale")
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseScale.value = value;
  });

gui.addColor(params, "uLowColor").onFinishChange((value) => {
  shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
});

gui.addColor(params, "uHighColor").onFinishChange((value) => {
  shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
});

gui
  .add(params, "uXspeed")
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uXspeed.value = value;
  });

  gui
  .add(params, "uZspeed")
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uZspeed.value = value;
  });

  gui
  .add(params, "uNoiseSpeed")
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseSpeed.value = value;
  });

  gui
  .add(params, "uOpacity")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uOpacity.value = value;
  });

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 1024, 1024),
  // new THREE.MeshBasicMaterial({color:0xff0000})
  shaderMaterial
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// 改善曝光程度
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// 定义渲染器输出编码
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMapping  = THREE.ReinhardToneMapping
// renderer.toneMapping  = THREE.CineonToneMapping
// renderer.toneMappingExposure = 0.2;

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
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.5;
// // 垂直旋转的角度的上限(0~Math.PI)
// controls.maxPolarAngle = (Math.PI / 4) * 3;
// // 允许垂直旋转的角度的下限(0~Math.PI)
// controls.minPolarAngle = (Math.PI / 4) * 3;

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  shaderMaterial.uniforms.uTime.value = elapsedTime;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

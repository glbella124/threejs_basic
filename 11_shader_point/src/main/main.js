import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import fragmentShader from "../shader/basic/fragment.glsl"
import vertexShader from "../shader/basic/vertex.glsl"
import { ShaderMaterial } from "three";

// shader -- 粒子效果 -- 旋转银河系

//创建gui对象
// const gui = new dat.GUI();
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

// 查看3维坐标轴的辅助轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// const geometry = new THREE.BufferGeometry();
// const positions = new Float32Array([0, 0, 0]);
// geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));


// 导入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./textures/particles/8.png")
const texture1 = textureLoader.load('textures/particles/5.png');
const texture2 = textureLoader.load('textures/particles/2.png');
// 点材质
// const material = new THREE.PointsMaterial({
//   color:0xff0000,
//   size:40,
//   sizeAttenuation:true
// })

// 着色器材质
// const material = new THREE.ShaderMaterial({
//   uniforms:{
//     uTexture:{
//       value:texture
//     }
//   },
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   transparent:true
// });

// // 生成点
// const points = new THREE.Points(geometry, material);
// scene.add(points);


let geometry;
let points=null
let material = null;

// 设置星系的参数

const params = {
  // 点多以后效果更好
  count: 10000,
  size: 0.1,
  radius: 5,
  branches: 3,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
  spin: 0.5,
};

let centerColor = new THREE.Color(params.color);
let endColor = new THREE.Color(params.endColor);

const generateGalaxy = () => {
  // 如果已经存在这些顶点，那么先释放内存，再删除顶点数据
  if(points != null){
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  // 随机生成位置
  const positions = new Float32Array(params.count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3);
  const scales = new Float32Array(params.count);
  // 图案属性
  const imgIndex = new Float32Array(params.count)

  // 循环生成顶点
  for (let i = 0; i < params.count; i++) {
    // 三个分支
    // 求余决定在哪条分支上 - 决定角度
    const branchAngel = (i % params.branches) * ((2 * Math.PI) / params.branches);

    // 效果1 - 当前点距离圆心的距离
    const distance = Math.random() * params.radius;

    // 效果2 - 越往边沿越来越小- 范围(0,1)Math.pow(Math.random(), 3)
    // const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);

    const current = i * 3;

    // 效果1：使得点随机散开
    // 三次方 - 中间聚拢，两边分散的效果
    // const randomX = Math.pow(Math.random() * 2 - 1, 3);
    // const randomY = Math.pow(Math.random() * 2 - 1, 3);
    // const randomZ = Math.pow(Math.random() * 2 - 1, 3);

    // 效果2：和当前距离圆心的距离有关
    // 距离越近随机范围越大 - 中间集中，两边分散,比效果1好些
    // const randomX = Math.pow(Math.random() * 2 - 1, 3) * distance/5;
    // const randomY = Math.pow(Math.random() * 2 - 1, 3) * distance/5;
    // const randomZ = Math.pow(Math.random() * 2 - 1, 3) * distance/5;

    // 效果3分布较为均匀
    // const randomZ = Math.random();
    // const randomX = Math.random();
    // const randomY = Math.random();

    // 效果4 - 由中间均匀分散到尾巴
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

    // 效果5 - 随机设置x/y/z偏移值
    // const randomX =
    //   Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - distance) * 0.3;
    // const randomY =
    //   Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - distance) * 0.3;
    // const randomZ =
    //   Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - distance) * 0.3;

    // 方案1 -- 当前点的位置 - 控制弯曲程度 params.rotateScale
    positions[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    positions[current + 1] = 0 + randomY;
    // 控制弯曲的角度
    positions[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;

    // 方案2 -- 
    // positions[current] = Math.cos(branchAngel) * distance + randomX;
    // // 设置当前点y值坐标
    // positions[current + 1] = randomY;
    // // 设置当前点z值坐标
    // positions[current + 2] = Math.sin(branchAngel) * distance + randomZ;

    // 混合颜色，形成渐变色 -- 片元着色器中可通过属性color属性获取
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;

    // 顶点的大小
    scales[current] = Math.random();

    // 根据索引值设置不同的图案
    imgIndex[current] = current%3;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("imgIndex", new THREE.BufferAttribute(imgIndex, 1));


  // 设置点的着色器材质
  material = new THREE.ShaderMaterial({
  uniforms:{
    uTexture:{
      value:texture
    },
    uTexture1:{
      value:texture1
    },
    uTexture2:{
      value:texture2
    },
    uTime:{
      value:0
    },
  },
  vertexColors:true,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent:true,
  // 挡住以后后面不显示
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

  // material = new THREE.PointsMaterial({
  //   // color: new THREE.Color(params.color),
  //   size: params.size,
  //   // 远近距离大小不一样 - 相机深度衰减
  //   sizeAttenuation: true,
  //   // 深度检测，物体被挡住以后不再计算
  //   depthWrite: false,
  //   // 效果叠加增强
  //   blending: THREE.AdditiveBlending,
  //   map: particlesTexture,
  //   alphaMap: particlesTexture,
  //   transparent: true,
  //   // 顶点颜色
  //   vertexColors: true,
  // });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy()

// 改善曝光程度
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.shadowMap.enabled = true;

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
  material.uniforms.uTime.value = elapsedTime
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

import * as THREE from "three";
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  OrthographicCamera,
  WebGLBufferRenderer,
} from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 用于鼠标移动镜头
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// 导入dat.gui
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 3D全屏滚动官网
// 同步屏幕滚动与相机
// 切屏触发当前屏幕物体
// gsap控制网页切屏文字

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./textures/particles/1.png");
camera.position.set(0, 0, 20);
scene.add(camera);

const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

// 1000cube
let cubeArr = [];
let cubeGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4);
      cubeGroup.add(cube);
      cubeArr.push(cube);
    }
  }
}

scene.add(cubeGroup);

// ------------- 1
// 创建三角形酷炫物体
// 添加物体
// 创建几何体
let triangleGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  // 每个三角形需要三个顶点，每个顶点需要三个值
  const geometry = new THREE.BufferGeometry();
  const position = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    // y值往下移
    position[j] = Math.random() * 10 - 5;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  // 根据几何体和材质创建物体

  let triangleMesh = new THREE.Mesh(geometry, material);
  // console.log(mesh);
  triangleGroup.add(triangleMesh);
}
triangleGroup.position.set(0, -30, 0);

scene.add(triangleGroup);

// ------------- 2
// 创建弹跳小球组
const sphereGroup = new THREE.Group();
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 投射阴影
sphere.castShadow = true;
sphereGroup.add(sphere);

// 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, sphereMaterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
sphereGroup.add(plane);
// 环境光 soft white light - 四面八方打过来的光
const light = new THREE.AmbientLight(0xffffff, 0.6);
sphereGroup.add(light);

const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

smallBall.position.set(2, 2, 2);

// 点光源
const pointLight = new THREE.PointLight(0xff0000, 3);
pointLight.position.set(2, 2, 2);
// 设置光照投射阴影
pointLight.castShadow = true;

// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图分辨率 - 阴影更加细致
pointLight.shadow.mapSize.set(512, 512);
// pointLight.decay = 0;
smallBall.add(pointLight);
sphereGroup.add(smallBall);

sphereGroup.position.set(0, -60, 0);
scene.add(sphereGroup);

let arrGroup = [cubeGroup, triangleGroup, sphereGroup];

// ---------- 3
// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();

// 鼠标移动事件 - 鼠标划过经过了什么物体
// 监听鼠标的位置
window.addEventListener("mousemove", (event) => {
  // -0.5 -- 0.5
  mouse.x = event.clientX / window.innerWidth - 0.5;
  mouse.y = event.clientY / window.innerHeight - 0.5;
});

// 鼠标点击事件
window.addEventListener("click", (event) => {
  // -1 -- 1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  // 检测物体
  let result = raycaster.intersectObjects(cubeArr);
  // console.log(result);
  // 只显示第一个
  // result[0].object.material = redMaterial
  // 循环显示所有的
  result.forEach((item) => {
    item.object.material = redMaterial;
  });
});

// 渲染器透明
const renderer = new THREE.WebGLRenderer({ alpha: true });
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const clock = new THREE.Clock();

// 利用动画库使物体运动，在render里会冲突
// https://greensock.com/get-started
gsap.to(cubeGroup.rotation, {
  x: "+=" + Math.PI,
  y: "+=" + Math.PI,
  duration: 10,
  ease: "power2.inOut",
  repeat: -1,
});

gsap.to(triangleGroup.rotation, {
  x: "-=" + Math.PI,
  y: "+=" + Math.PI,
  duration: 12,
  ease: "power2.inOut",
  repeat: -1,
});

gsap.to(smallBall.position, {
  x: -3,
  duration: 6,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
});

gsap.to(smallBall.position, {
  y: 0,
  duration: 0.5,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
});

// 动画循环
function render() {
  // let time = clock.getElapsedTime();
  // 获得前后两次执行该方法的时间间隔
  let deltaTime = clock.getDelta();

  // 光线追踪
  // cubeGroup.rotation.x = time * 0.5;
  // cubeGroup.rotation.y = time * 0.5;

  // // 三角形
  // triangleGroup.rotation.x = time * 0.4;
  // triangleGroup.rotation.z = time * 0.3;

  // // 弹跳小球
  // smallBall.position.x = Math.sin(time) * 3;
  // smallBall.position.z = Math.cos(time) * 3;
  // smallBall.position.y = 2 + Math.sin(time * 10) / 2;
  // sphereGroup.rotation.z = Math.sin(time) * 0.05;
  // sphereGroup.rotation.x = Math.sin(time) * 0.05;

  // 根据当前滚轮的scrollY ， 设置相机移动的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 30;
  // deltaTime -- 毫秒数
  // 相机左右晃动
  camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 3;

  // triangleMesh.rotation.x = time*0.4
  // triangleMesh.rotation.z = time*0.3
  // controls.update();
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

let currentPage = 0;
// 监听滚动事件
window.addEventListener("scroll", () => {
  // 获取当前滚动页数 当前值/高度
  const newPage = Math.round(window.scrollY / window.innerHeight);
  if (newPage != currentPage) {
    currentPage = newPage;
    console.log("页面改变，当前是: " + currentPage);
    // gsap -- 进行旋转
    gsap.to(arrGroup[currentPage].rotation, {
      z: "+=" + Math.PI * 2,
      x: "+=" + Math.PI * 2,
      duration: 2,
      onComplete: () => {
        console.log("旋转完成");
      },
    });

    // gsap.to(`.page${currentPage} h1`,{
    //   rotate:"+=360",
    //   duration:1
    // })
    // 控制网页切屏文字动画
    gsap.fromTo(
      `.page${currentPage} h1`,
      { x: -300 },
      { x: 0, rotate: "+=360", duration: 1 }
    );
  }
});

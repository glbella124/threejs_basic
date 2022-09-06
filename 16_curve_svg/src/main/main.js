import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

// 创建曲线对象

// threejs中渲染的对象
let curve;

let renderObj = {
  camera: null,
  scene: null,
  renderer: null,
  labelRenderer: null,
  chinaLabel: null,
  chinaDiv: null,
  earthDiv: null,
  earthLabel: null,
  moonDiv: null,
  moonLabel: null,
};

// 地球object相关属性
let earthObj = {
  earth: null,
  geometry: null,
  material: null,
  radius: 1,
};

// 月球object相关属性
let moonObj = {
  moon: null,
  geometry: null,
  material: null,
  radius: 0.27,
};

// 光线相关属性
let lightObject = {
  directionLight: null,
  light: null,
};

// 时间
const clock = new THREE.Clock();
// 纹理加载器
const textureLoader = new THREE.TextureLoader();
// 实例化射线
const raycaster = new THREE.Raycaster();

// 初始化渲染
init();
// 动画
animate();

function init() {
  renderObj.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  renderObj.camera.position.set(0, 5, -10);

  renderObj.scene = new THREE.Scene();

  //   光线
  lightObject.directionLight = new THREE.DirectionalLight(0xffffff);
  lightObject.directionLight.position.set(0, 0, 1);
  renderObj.scene.add(lightObject.directionLight);
  lightObject.light = new THREE.AmbientLight(0xffffff, 0.5);
  renderObj.scene.add(lightObject.light);

  const axesHelper = new THREE.AxesHelper(5);
  renderObj.scene.add(axesHelper);

  //  create earth
  earthObj.geometry = new THREE.SphereGeometry(earthObj.radius, 16, 16);
  earthObj.material = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load("textures/planets/earth_atmos_2048.jpg"),
    specularMap: textureLoader.load("textures/planets/earth_specular_2048.jpg"),
    normalMap: textureLoader.load("textures/planets/earth_normal_2048.jpg"),
    normalScale: new THREE.Vector2(0.85, 0.85),
  });

  earthObj.earth = new THREE.Mesh(earthObj.geometry, earthObj.material);
  renderObj.scene.add(earthObj.earth);

  // create moon
  moonObj.geometry = new THREE.SphereGeometry(moonObj.radius, 16, 16);
  moonObj.material = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load("textures/planets/moon_1024.jpg"),
  });
  moonObj.moon = new THREE.Mesh(moonObj.geometry, moonObj.material);
  renderObj.scene.add(moonObj.moon);

  //   add label for earth, moon, china
  renderObj.earthDiv = document.createElement("div");
  renderObj.earthDiv.className = "label";
  renderObj.earthDiv.innerHTML = "Earth";
  renderObj.earthLabel = new CSS2DObject(renderObj.earthDiv);
  renderObj.earthLabel.position.set(0, 1, 0);
  earthObj.earth.add(renderObj.earthLabel);

  renderObj.chinaDiv = document.createElement("div");
  renderObj.chinaDiv.className = "label1";
  renderObj.chinaDiv.innerHTML = "China";
  renderObj.chinaLabel = new CSS2DObject(renderObj.chinaDiv);
  renderObj.chinaLabel.position.set(-0.3, 0.5, -0.9);
  earthObj.earth.add(renderObj.chinaLabel);

  renderObj.moonDiv = document.createElement("div");
  renderObj.moonDiv.className = "label";
  renderObj.moonDiv.innerHTML = "Moon";
  renderObj.moonLabel = new CSS2DObject(renderObj.moonDiv);
  renderObj.moonLabel.position.set(0, 0.3, 0);
  moonObj.moon.add(renderObj.moonLabel);

  // create curve based on a series of points
  // 使用Catmull-Rom算法， 从一系列的点创建一条平滑的三维样条曲线。
  curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-10, 0, 10),
      new THREE.Vector3(-5, 5, 5),
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(5, -5, 5),
      new THREE.Vector3(10, 0, 10),
    ],
    true
  );

  // 在曲线里，getPoints获取51个点
  const points = curve.getPoints(500);
  console.log(points);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  renderObj.scene.add(curveObject)



  //实例化css 2d的渲染器
  renderObj.labelRenderer = new CSS2DRenderer();
  renderObj.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderObj.labelRenderer.domElement);
  renderObj.labelRenderer.domElement.style.position = "fixed";
  renderObj.labelRenderer.domElement.style.top = "0px";
  renderObj.labelRenderer.domElement.style.left = "0px";
  renderObj.labelRenderer.domElement.style.zIndex = "10";

  renderObj.renderer = new THREE.WebGLRenderer();
  renderObj.renderer.setPixelRatio(window.devicePixelRatio);
  renderObj.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderObj.renderer.domElement);

  const controls = new OrbitControls(
    renderObj.camera,
    renderObj.labelRenderer.domElement
  );
  controls.minDistance = 5;
  controls.maxDistance = 100;

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  renderObj.camera.aspect = window.innerWidth / window.innerHeight;

  renderObj.camera.updateProjectionMatrix();

  renderObj.renderer.setSize(window.innerWidth, window.innerHeight);
  renderObj.labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  moonObj.moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

  // 克隆china标签位置 -- 避免位置错误
  const chinaPosition = renderObj.chinaLabel.position.clone();
  // 计算出标签跟摄像机的距离
  const labelDistance = chinaPosition.distanceTo(renderObj.camera.position);
  // 检测射线的碰撞
  // project -- 将此向量从世界空间投影到相机的标准化设备坐标(NDC)空间
  chinaPosition.project(renderObj.camera);
  raycaster.setFromCamera(chinaPosition, renderObj.camera);
  const intersects = raycaster.intersectObjects(renderObj.scene.children, true);

  // 需要考虑的情况： 检测到有物体，没有物体，div标签
  // 没有碰撞到任何物体,让标签显示
  if (intersects.length === 0) {
    renderObj.chinaLabel.element.classList.add("visible");
  } else {
    // 碰撞物体距离
    // intersects里第一个是距离最近的
    const minDistance = intersects[0].distance;
    // console.log(minDistance, labelDistance);

    if (minDistance < labelDistance) {
      // 物体遮挡时隐藏标签
      renderObj.chinaLabel.element.classList.remove("visible");
    } else {
      //显示物体标签
      renderObj.chinaLabel.element.classList.add("visible");
    }
  }

  // 碰撞到以后,先找物体最近的距离
  // 球比标签距离近,球挡住了标签

  //   标签渲染器渲染
  renderObj.labelRenderer.render(renderObj.scene, renderObj.camera);
  renderObj.renderer.render(renderObj.scene, renderObj.camera);
}

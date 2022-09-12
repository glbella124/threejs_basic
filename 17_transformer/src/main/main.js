import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 变形动画
const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

// 设置相机位置
camera.position.set(0, 3, 50);
scene.add(camera);
const loader = new RGBELoader();

loader.load("./textures/038.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 加载纹理
const textureLoader = new THREE.TextureLoader();
let params = {
  value: 0,
  value1:0
};

// 加载压缩的glb模型
let material = null;
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/gltf/");
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);

let stem, petal, stem1, petal1, stem2, petal2;
gltfLoader.load("./model/f4.glb", (gltf1) => {
  console.log(gltf1.scene);
  // 茎
  stem = gltf1.scene.children[0];
  // 花瓣
  petal = gltf1.scene.children[1];
  gltf1.scene.rotation.x = Math.PI;
  //   未显示水，筛选材质
  gltf1.scene.traverse((item) => {
    if (item.material && item.material.name === "Water") {
      item.material = new THREE.MeshStandardMaterial({
        color: "skyblue",
        depthWrite: false,
        transparent: true,
        depthTest: false,
        opacity: 0.5,
      });
    }

    if (item.material && item.material.name === "Stem") {
      stem = item;
    }

    if (item.material && item.material.name === "Petal") {
      petal = item;
    }
  });

  //   状态2
  gltfLoader.load("./model/f2.glb", (gltf2) => {
    gltf2.scene.traverse((item) => {
      if (item.material && item.material.name === "Stem") {
        stem1 = item;
        // 导出来数据的属性
        stem.geometry.morphAttributes.position = [
          stem1.geometry.attributes.position,
        ];
        // 更新基础形变数据
        stem.updateMorphTargets();
      }
      if (item.material && item.material.name === "Petal") {
        petal1 = item;
        petal.geometry.morphAttributes.position = [
          petal1.geometry.attributes.position,
        ];
        petal.updateMorphTargets();
      }

      //   花绽放状态
      gltfLoader.load("./model/f1.glb", (gltf2) => {
        // 可以遍历该场景中的所有子物体来执行回调函数
        gltf2.scene.traverse((item) => {
          if (item.material && item.material.name === "Stem") {
            stem2 = item;
            // 导出来数据的属性
            stem.geometry.morphAttributes.position.push(
              stem2.geometry.attributes.position
            );

            // 更新基础形变数据
            stem.updateMorphTargets();
          }
          if (item.material && item.material.name === "Petal") {
            petal2 = item;
            petal.geometry.morphAttributes.position.push(
              petal2.geometry.attributes.position
            );

            petal.updateMorphTargets();
          }
        });
      });
    });

    gsap.to(params, {
      value: 1,
      duration: 4,
      onUpdate: () => {
        stem.morphTargetInfluences[0] = params.value;
        petal.morphTargetInfluences[0] = params.value;
      },
      onComplete:()=>{
        gsap.to(params,{
            value1: 1,
            duration: 4,
            onUpdate:()=>{
              stem.morphTargetInfluences[1] = params.value1;
              petal.morphTargetInfluences[1] = params.value1;
            } 
        })
      }
    });
  });

  scene.add(gltf1.scene);
});
// gltfLoader.load("./model/sphere1.glb",(gltf1)=>{
//     console.log(gltf1.scene);
//     scene.add(gltf1.scene)
//     let sphere1 = gltf1.scene.children[0]
//     gltfLoader.load("./model/sphere2.glb",(gltf2)=>{
//         console.log(gltf2,"sphere2");
//         // 存放变形物体数组
//         // morphAttributes -- 存储BufferAttribute的Hashmap,存储几何体变形目标的细节信息
//         // 存放顶点数据
//         sphere1.geometry.morphAttributes.position = []
//         sphere1.geometry.morphAttributes.position.push(gltf2.scene.children[0].geometry.attributes.position)
//         // 重置为空数组
//         sphere1.updateMorphTargets()
//         // 一个包含了权重的数组，指定应用了多少变形
//         // 默认情况未定义，会被updateMorphTargets重置为空数组
//         // sphere1.morphTargetInfluences[0] = 1
//         gsap.to(params,{
//             value:1,
//             duration:2,
//             repeat:-1,
//             yoyo:true,
//             onUpdate:()=>{
//                 sphere1.morphTargetInfluences[0] = params.value
//             }
//         })
//     })
// })

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  logarithmicDepthBuffer: true,
  antialias: true,
});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0xcccccc, 1);
renderer.autoClear = false;
// 设置电影渲染模式
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.sortObjects = true;
renderer.logarithmicDepthBuffer = true;

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  let time = clock.getDelta();
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

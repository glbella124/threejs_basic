import * as THREE from "three";

// 初始化场景
const scene = new THREE.Scene();

// 设置场景天空盒
const textureCubeLaoder = new THREE.CubeTextureLoader();
const baseUrl = "./textures/";
const textureCube = textureCubeLaoder.load([
  `${baseUrl}1.jpg`,
  `${baseUrl}2.jpg`,
  `${baseUrl}3.jpg`,
  `${baseUrl}4.jpg`,
  `${baseUrl}5.jpg`,
  `${baseUrl}6.jpg`,
]);

scene.background = textureCube
scene.environment = textureCube
export default scene;

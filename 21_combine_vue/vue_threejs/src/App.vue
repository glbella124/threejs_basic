<script setup lang="ts">
import * as THREE from "three";
import { WebGLBufferRenderer } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 使用渲染器，通过相机将场景渲染进来
document.body.appendChild(renderer.domElement);

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// 将网格添加到场景中
scene.add(cube);
camera.position.z = 5;
camera.lookAt(0, 0, 0);
// 渲染函数
function animate() {
  requestAnimationFrame(animate);
  // 旋转
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
</script>

<template>
  <div></div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>

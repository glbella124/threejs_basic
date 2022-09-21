<template>
  <div class="scene" ref="sceneDiv"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import scene from "@/hooks/three/basic/scene"
import camera from "@/hooks/three/basic/camera"
import axesHelper from "@/hooks/three/basic/axesHelper"
// 导入渲染器
import renderer from "@/hooks/three/basic/renderer"
// 导入每一帧的执行函数
import animate from "@/hooks/three/basic/animate"
import gui from "@/hooks/three/basic/gui"
// 自适应屏幕大小
import "@/hooks/three/basic/init"
// 导入控制器
import controls from "@/hooks/three/basic/controls"
// gsap动画库
import gsap from "gsap";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import createMesh from "@/hooks/three/basic/createMesh"
// import vertex from "@/hooks/three/shader/flyline/vertex.glsl";

// console.log(vertex);

let sceneDiv: any = ref(null);

// 添加相机，辅助坐标轴
scene.add(camera);
scene.add(axesHelper);
createMesh()

onMounted(() => {
  
  // 将渲染器添加到sceneDiv中
  sceneDiv.value.appendChild(renderer.domElement);
  animate();
});
</script>
<style lang="scss">
  .scene{
    background: #000;
  }
</style>

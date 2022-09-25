<template>
  <div class="scene" ref="sceneDiv"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import scene from "@/hooks/three/basic/scene";
import camera from "@/hooks/three/basic/camera";
import axesHelper from "@/hooks/three/basic/axesHelper";
// 导入渲染器
import renderer from "@/hooks/three/basic/renderer";
// 导入每一帧的执行函数
import animate from "@/hooks/three/basic/animate";
import gui from "@/hooks/three/basic/gui";
// 导入控制器
import controls from "@/hooks/three/basic/controls";
// 自适应屏幕大小
import "@/hooks/three/basic/init";
// gsap动画库
import gsap from "gsap";
import createMesh from "@/hooks/three/basic/createMesh";
import AlarmSprite from "@/hooks/three/mesh/AlarmSprite";
import { advancePositionWithClone } from "@vue/compiler-core";
import LightWall from "@/hooks/three/mesh/LightWall";
import FlyLineShader from "@/hooks/three/mesh/FlyLineShader";
import LightRadar from "@/hooks/three/mesh/LightRadar";
import eventHub from "@/utils/eventHub";
import { isTSEnumMember } from "@babel/types";

const props = defineProps(["eventList"]);

let sceneDiv: any = ref(null);

// 添加相机，辅助坐标轴
scene.add(camera);
scene.add(axesHelper);
createMesh();

onMounted(() => {
  // 将渲染器添加到sceneDiv中
  sceneDiv.value.appendChild(renderer.domElement);
  animate();
});

// 存储精灵文字
const eventListMesh: Array<any> = [];

// 根据火警，治安等不同类型添加不同的特效
let mapFn: any = {
  火警: (position: any, i: any) => {
    const lightWall: any = new LightWall(1, 2, position);
    lightWall.eventListIndex = i;
    scene.add(lightWall.mesh);
    eventListMesh.push(lightWall);
  },
  治安: (position: any, i: any) => {
    // 生成随机颜色
    const color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    ).getHex();
    const flyLineShader: any = new FlyLineShader(position, color);
    flyLineShader.eventListIndex = i;
    scene.add(flyLineShader.mesh);
    eventListMesh.push(flyLineShader);
  },
  电力: (position: any, i: any) => {
    const lightRadar: any = new LightRadar(2, position);
    lightRadar.eventListIndex = i;
    scene.add(lightRadar.mesh);
    eventListMesh.push(lightRadar);
  },
};

// 选中显示，其余隐藏
eventHub.on("eventToggle", (i: any) => {
  eventListMesh.forEach((item) => {
    if (item.eventListIndex === i) {
      console.log(item.eventListIndex);
      item.mesh.visible = true;
    } else {
      item.mesh.visible = false;
    }
  });
  const position = {
    x: props.eventList[i].position.x / 5 - 10,
    y: 0,
    z: props.eventList[i].position.y / 5 - 10,
  };
  //   controls.target.set(position.x, position.y, position.z);
  gsap.to(controls.target, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
  });
});

watch(
  () => props.eventList,
  (val) => {
    // if (eventListMesh.length > 0) {
    //   eventListMesh.forEach((item) => {
    //     item.remove();
    //   });
    // }
    eventListMesh.forEach((item) => {
      item.remove();
    });
    props.eventList.forEach((item: any, i: number) => {
      const position = {
        x: item.position.x / 5 - 10,
        z: item.position.y / 5 - 10,
      };
      const alarmSprite:any = new AlarmSprite(item.name, position);
      // 精灵文字点击事件
      alarmSprite.onClick(() => {
        eventHub.emit("spriteClick", { event: item, i });
      });
      alarmSprite.eventListIndex = i;
      // 点击文字时作为互动标识
      eventListMesh.push(alarmSprite);
      scene.add(alarmSprite.mesh);
      if (mapFn[item.name]) {
        mapFn[item.name](position, i);
      }
    });
  }
);
</script>
<style lang="scss" scoped>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>

<template>
  <div class="home" ref="container"></div>
  <div class="map">
    <div class="tag" ref="tagDiv"></div>
    <img src="@/assets/house/map.gif" />
  </div>
  <div class="loading" v-if="progress != 100"></div>
  <div class="progress" v-if="progress != 100">
    <img src="@/assets/house/loading.gif" alt="" />
    <span>新房奔跑中：{{ progress }}%</span>
  </div>
  <div class="title">VR HOUSE</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import threeCom from "@/hooks/useThree/Threejs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import SpriteCanvas from "@/hooks/useThree/SpriteCanvas";

let tagDiv: any = ref(null);
let progress: any = ref(0);
// three三维场景初始化
threeCom.initThree();
let scene = threeCom.scene;
let camera = threeCom.camera;
let renderer = threeCom.renderer;
const container: any = ref(null);

onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
  // 容器
  container.value.appendChild(renderer.domElement);
  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();

  let isMouseDown = false;
  // 监听鼠标事件
  container.value.addEventListener("mousedown", () => {
    isMouseDown = true;
  });
  container.value.addEventListener(
    "mouseup",
    () => {
      isMouseDown = false;
    },
    false
  );
  // 鼠标离开
  container.value.addEventListener("mouseout", () => {
    isMouseDown = false;
  });

  // 根据是否按下鼠标，移动鼠标
  container.value.addEventListener("mousemove", (event: any) => {
    if (isMouseDown) {
      camera.rotation.y += event.movementX * 0.002;
      camera.rotation.x += event.movementY * 0.002;
      // 更改默认旋转方向(xyz) -- 保证Y轴先转
      camera.rotation.order = "YXZ";
    }
  });

  tagDiv.value.style.cssText = `transform:translate(100px,110px)`;
  let moveTag = (name: string) => {
    let positions: any = {
      livingroom: [100, 110],
      kitchen: [180, 190],
      balcony: [50, 50],
      corridor: [130, 80],
    };
    if (positions[name]) {
      gsap.to(tagDiv.value, {
        duration: 0.5,
        x: positions[name][0],
        y: positions[name][1],
        ease: "power3.inOut",
      });
    }
  };
  // 创建房间
  // 创建起居室 -- 原点，无旋转
  let livingPosition = threeCom.createVector3(0, 0, 1);
  threeCom.makeCube("livingroom", 0, "./img/livingroom/", livingPosition);

  // 创建厨房 -- 位置，旋转角度
  let kitPosition = threeCom.createVector3(-5, 0, -10);
  let kitEuler = threeCom.createEuler(0, -Math.PI / 2, 0);
  threeCom.makeCube("kitchen", 3, "./img/kitchen/", kitPosition, kitEuler);

  // 创建阳台
  let balconyPosition = threeCom.createVector3(0, 0, 15);
  let balconyEuler = threeCom.createEuler(0, Math.PI / 16, 0);
  threeCom.makeCube(
    "balcony",
    8,
    "./img/balcony",
    balconyPosition,
    balconyEuler
  );

  //创建走廊
  let corridorPosition = threeCom.createVector3(-15, 0, 0);
  let corridorEuler = threeCom.createEuler(0, -Math.PI + Math.PI / 16, 0);
  threeCom.makeCube(
    "corridor",
    9,
    "./img/corridor",
    corridorPosition,
    corridorEuler
  );

  // 创建主卧
  let bedroomPosition = threeCom.createVector3(-27, 0, 2);
  let bedroomEuler = threeCom.createEuler(0, -Math.PI / 2, 0);
  threeCom.makeCube(
    "bedroom",
    18,
    "./img/bedroom",
    bedroomPosition,
    bedroomEuler
  );

  // 文字精灵
  const textLivingroom = new SpriteCanvas(camera, "客厅", [-4, 0, -6]);
  scene.add(textLivingroom.mesh);
  const textKitchen = new SpriteCanvas(camera, "厨房", [-1, 0, -3]);
  scene.add(textKitchen.mesh);
  const textBalcony = new SpriteCanvas(camera, "阳台", [0, 0, 3]);
  scene.add(textBalcony.mesh);
  // 阳台回客厅
  const textBalconyToLiving = new SpriteCanvas(camera, "客厅", [-1, 0, 11]);
  scene.add(textBalconyToLiving.mesh);
  const textCorridor = new SpriteCanvas(camera, "走廊", [-4, 0, 0.5]);
  scene.add(textCorridor.mesh);
  // 走廊回客厅
  const textCorridorToLiving = new SpriteCanvas(camera, "客厅", [-11, 0, 0]);
  scene.add(textCorridorToLiving.mesh);
  // 主卧
  const textBedroom = new SpriteCanvas(camera, "主卧", [-19, 0, 2]);
  scene.add(textBedroom.mesh);
  // 主卧回走廊
  const textBedroomToCorridor = new SpriteCanvas(camera, "走廊", [-23, 0, -2]);
  scene.add(textBedroomToCorridor.mesh);

  // 跳转动画
  textKitchen.onClick(() => {
    console.log("厨房");
    gsap.to(camera.position, {
      x: kitPosition.x,
      y: kitPosition.y,
      z: kitPosition.z,
      duration: 1,
    });
    moveTag("kitchen");
  });

  textLivingroom.onClick(() => {
    console.log("客厅");
    gsap.to(camera.position, {
      x: livingPosition.x,
      y: livingPosition.y,
      z: livingPosition.z,
      duration: 1,
    });
    moveTag("livingroom");
  });

  textBalcony.onClick(() => {
    console.log("阳台");
    gsap.to(camera.position, {
      x: balconyPosition.x,
      y: balconyPosition.y,
      z: balconyPosition.z,
      duration: 1,
    });
    moveTag("balcony");
  });

  textBalconyToLiving.onClick(() => {
    gsap.to(camera.position, {
      x: livingPosition.x,
      y: livingPosition.y,
      z: livingPosition.z,
      duration: 1,
    });
    moveTag("livingroom");
  });

  textCorridor.onClick(() => {
    console.log("走廊");
    gsap.to(camera.position, {
      x: corridorPosition.x,
      y: corridorPosition.y,
      z: corridorPosition.z,
      duration: 1,
    });
    moveTag("corridor");
  });

  textCorridorToLiving.onClick(() => {
    gsap.to(camera.position, {
      x: livingPosition.x,
      y: livingPosition.y,
      z: livingPosition.z,
      duration: 1,
    });
    moveTag("livingroom");
  });

  textBedroom.onClick(() => {
    gsap.to(camera.position, {
      x: bedroomPosition.x,
      y: bedroomPosition.y,
      z: bedroomPosition.z,
      duration: 1,
    });
  });

  textBedroomToCorridor.onClick(() => {
    gsap.to(camera.position, {
      x: corridorPosition.x,
      y: corridorPosition.y,
      z: corridorPosition.z,
      duration: 1,
    });
    moveTag("corridor");
  });

  threeCom.three.DefaultLoadingManager.onProgress = (
    item: any,
    loaded: any,
    total: any
  ) => {
    progress.value = new Number((loaded / total) * 100).toFixed(2);
    console.log("进度", progress.value);
  };
});
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
.map {
  width: 300px;
  height: 260px;
  position: absolute;
  left: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.map > img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.map > .tag {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  background-image: url("../assets/house/location.png");
  background-size: cover;
  z-index: 1;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/house/loading.png");
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}

.title {
  width: 180px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
}
</style>

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import gsap from "gsap";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

class Threejs {
  scene: any;
  camera: any;
  threeDom: any;
  //渲染器
  renderer: any;
  //标签渲染器
  axes: any;
  three:any = THREE

  // 初始化3D场景
  initThree() {
    // this.threeDom = dom;
    // 初始化场景
    this.scene = new THREE.Scene();
    // 初始化相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 设置相机位置
    this.camera.position.set(0, 0, 1);
    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(this.renderer.domElement);

    // 创建辅助坐标轴
    this.axes = new THREE.AxesHelper(5);
    this.scene.add(this.axes);
  }

  //   创建立方体
  makeCube(
    name: string,
    roomIndex: number,
    textureUrl: string,
    position: any = new THREE.Vector3(0, 0, 0),
    euler: any = new THREE.Euler(0, 0, 0)
  ) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    geometry.scale(1, 1, -1);

    // textureUrl = "./three/living/";
    const arr = [
      `${roomIndex}_l`,
      `${roomIndex}_r`,
      `${roomIndex}_u`,
      `${roomIndex}_d`,
      `${roomIndex}_b`,
      `${roomIndex}_f`,
    ];
    const boxMaterials: any = [];
    arr.forEach((item) => {
      const texture = new THREE.TextureLoader().load(
        `${textureUrl}/${item}.jpg`
      );
      if (item === `${roomIndex}_d` || item === `${roomIndex}_u`) {
        texture.rotation = Math.PI;
        texture.center = new THREE.Vector2(0.5, 0.5);
        boxMaterials.push(
          new THREE.MeshBasicMaterial({ map: texture})
        );
      } else {
        boxMaterials.push(
          new THREE.MeshBasicMaterial({ map: texture})
        );
      }
    });

    const cube = new THREE.Mesh(geometry, boxMaterials);
    cube.position.copy(position);
    // 欧拉角描述一个旋转变换，通过指定轴顺序和其各个轴向上的指定旋转角度来旋,转一个物体。
    // http://www.webgl3d.cn/threejs/docs/?q=Euler#api/zh/math/Euler
    cube.rotation.copy(euler);
    this.scene.add(cube);
  }

  // 创建三维向量
  createVector3(x: number, y: number, z: number) {
    return new THREE.Vector3(x, y, z);
  }

  // 旋转角度
  createEuler(x: number, y: number, z: number) {
    return new THREE.Euler(x, y, z);
  }


}

export default new Threejs();

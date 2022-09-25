import * as THREE from "three";
import camera from "../basic/camera";

/**
 * 封装3D警告标识与点击提示事件
 * SpriteMaterial
 */
export default class AlarmSprite {
  mesh: any;
  material: any;
  fns: Array<any>;
  raycaster: any;
  mouse: any;
  constructor(type = "火警",position = { x: 0.5, z: -3 }, color = 0xffffff) {
    const textureLoader = new THREE.TextureLoader();
    const typeObj:any = {
      火警: "./textures/tag/fire.png",
      治安: "./textures/tag/jingcha.png",
      电力: "./textures/tag/e.png",
    };
    const map = textureLoader.load(typeObj[type]);
    this.material = new THREE.SpriteMaterial({
      map: map,
      color: color,
      transparent: true,
      depthTest:false
    });
    this.mesh = new THREE.Sprite(this.material);
    // 设置位置
    this.mesh.position.set(position.x, 3, position.z);

    // 封装点击事件
    // 根据投射光线进行碰撞监测
    this.fns = [];

    // 创建射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("click", (event: any) => {
      // 保证范围 -1 -- 1
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
      this.raycaster.setFromCamera(this.mouse, camera);

      event.mesh = this.mesh;
      event.alarm = this;
      //   设置监测碰撞的对象
      const intersects = this.raycaster.intersectObject(this.mesh);
      if (intersects.length > 0) {
        this.fns.forEach((fn: any) => {
          fn(event);
        });
      }
    });
  }

  onClick(fn: any) {
    this.fns.push(fn);
  }

  // 移除mesh
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

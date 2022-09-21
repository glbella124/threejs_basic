import * as THREE from "three";
import gsap from "gsap";

/**
 * FlyLine
 * 创建飞线
 * TubeGeometry -- 管道缓冲几何体;
 * 沿着三维曲线延伸的管道;
 * 不使用着色器的方式;
 * path — Curve - 一个由基类Curve继承而来的3D路径。 Default is a quadratic bezier curve.
 * tubularSegments — Integer - 组成这一管道的分段数，默认值为64。
 * radius — Float - 管道的半径，默认值为1。
 * radialSegments — Integer - 管道横截面的分段数目，默认值为8。
 * closed — Boolean 管道的两端是否闭合，默认值为false。
 *
 */
export default class FlyLine {
  lineCurve: any;
  geometry: any;
  texture: any;
  material: any;
  mesh: any;
  constructor() {
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 4, 0),
      new THREE.Vector3(8, 0, 0),
    ];
    // 1 -- 根据提供的点生成曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    // 2 -- 根据曲线生成管道几何体
    this.geometry = new THREE.TubeGeometry(this.lineCurve, 100, 0.4, 2, false);
    // 3 -- 设置飞线材质
    const textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load("./textures/z_11.png");
    this.texture.repeat.set(1, 2);
    // 使用RepeatWrapping，纹理将简单地重复到无穷大 -- 水平
    this.texture.wrapS = THREE.RepeatWrapping;
    // 使用MirroredRepeatWrapping， 纹理将重复到无穷大，在每次重复时将进行镜像。--垂直
    this.texture.wrapT = THREE.MirroredRepeatWrapping;
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
    });

    // 4 -- 创建飞线物体
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // 5 -- 创建飞线动画
    gsap.to(this.texture.offset, {
      x: -1,
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });
  }
}

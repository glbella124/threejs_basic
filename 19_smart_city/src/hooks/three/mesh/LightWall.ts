import * as THREE from "three";
import gsap from "gsap";
import vertex from "@/hooks/three/shader/lightwall/vertex.glsl";
import fragment from "@/hooks/three/shader/lightwall/fragment.glsl";
/**
 * 智慧城市光墙特效
 */
export default class LightWall {
  mesh: any;
  geometry: any;
  material: any;
  // eventListIndex:any=0
  constructor(
    radius: number = 2,
    length: number = 2,
    position: any = { x: 0, z: 0 },
    color:any = 0xffff00
  ) {
    this.geometry = new THREE.CylinderGeometry(radius, radius, 2, 32, 1, true);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: THREE.DoubleSide,
      // depthWrite: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, 0.5, position.z);

    // 根据高度差设置圆柱渐变效果
    // 计算后获取Bounding最大最小值
    this.mesh.geometry.computeBoundingBox();
    let { min, max } = this.mesh.geometry.boundingBox;
    let uHeight = max.y - min.x;
   

    this.material.uniforms.uHeight = {
      value: uHeight,
    };
    this.material.uniforms.uColor = {
      value:new THREE.Color(color)
    }

    // 光墙动画
    gsap.to(this.mesh.scale, {
      x: length,
      z: length,
      duration: 1,
      repeat: -1,
      // yoyo:true
    });
  }
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

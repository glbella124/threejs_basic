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
  constructor() {
    this.geometry = new THREE.CylinderGeometry(5, 5, 3, 32, 1, true);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side:THREE.DoubleSide,
      depthWrite:false
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0,0,0)

    // 根据高度差设置圆柱渐变效果
    // 计算后获取Bounding最大最小值
    this.mesh.geometry.computeBoundingBox()
    let {min,max} = this.mesh.geometry.boundingBox
    let uHeight = max.y - min.x
    console.log(uHeight,"uheight");
    
    this.material.uniforms.uHeight = {
        value:uHeight
    }

    // 光墙动画
    gsap.to(this.mesh.scale,{
        x:2,
        z:2,
        duration:1,
        repeat:-1,
        // yoyo:true

    })
  }
}

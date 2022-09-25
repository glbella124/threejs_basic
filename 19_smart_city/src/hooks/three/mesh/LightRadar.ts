import * as THREE from "three";
import gsap from "gsap";
import vertex from "@/hooks/three/shader/lightradar/vertex.glsl";
import fragment from "@/hooks/three/shader/lightradar/fragment.glsl";
/**
 * 光雷达特效
 */
export default class LightRadar {
  mesh: any;
  geometry: any;
  material: any;
  // eventListIndex:any=0
  constructor(radius = 2, position = { x: 0, z: 0 }, color = 0xff0000) {
    this.geometry = new THREE.PlaneGeometry(radius,radius);
    this.material = new THREE.ShaderMaterial({
      uniforms:{
        uColor:{
          value:new THREE.Color(color)
        },
        uTime:{
          value:0
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side:THREE.DoubleSide,
      // depthWrite:false
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x,0,position.z)
    this.mesh.rotation.x = -Math.PI/2

    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      // 匀速
      ease: "none",
    });

  }
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

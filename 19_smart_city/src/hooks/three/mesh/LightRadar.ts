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
  constructor() {
    this.geometry = new THREE.PlaneGeometry(1,1);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side:THREE.DoubleSide,
      // depthWrite:false
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(-5,1,3)
    this.mesh.rotation.x = -Math.PI/2

  }
}

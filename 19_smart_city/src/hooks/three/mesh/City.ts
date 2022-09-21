import * as THREE from "three";
import scene from "../basic/scene";
import modifyCityMaterial from "../modify/modifyCityMaterials";
import FlyLine from "./Flyline";
import FlyLineShader from "./FlyLineShader";
import MeshLine from "./MeshLine";
import LightWall from "./LightWall";
import LightRadar from "./LightRadar";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * 创建城市模型 -- 修改建筑材质
 */
export default function createCity() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("./model/city_building.glb", (gltf) => {
    gltf.scene.traverse((item: any) => {
      //   console.log(item);

      if (item.type === "Mesh") {
        const cityMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color("#8D38C9"),
        });
        item.material = cityMaterial;
        modifyCityMaterial(item);
        if (item.name === "Layerbuildings") {
          console.log(item);

          const meshLine = new MeshLine(item.geometry);
          // 获取原物体scale -> 线框物体比原物体稍大一些
          const size = item.scale.x * 1.001;
          meshLine.mesh.scale.set(size, size, size);
          scene.add(meshLine.mesh);
        }
      }
    });
    scene.add(gltf.scene);

    // 添加飞线
    const flyLine = new FlyLine();
    scene.add(flyLine.mesh);

    // 添加着色器飞线
    const flylineShader = new FlyLineShader();
    scene.add(flylineShader.mesh);

    // 添加光墙
    const lightWall = new LightWall()
    scene.add(lightWall.mesh)

    // 添加雷达平面
    const lightRadar = new LightRadar()
    scene.add(lightRadar.mesh)
  });
}

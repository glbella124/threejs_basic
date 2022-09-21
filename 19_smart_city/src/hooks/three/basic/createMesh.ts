import * as THREE from "three";
import scene from "./scene";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import createCity from "../mesh/City";

/**
 * 创建城市模型
 */
export default function createMesh() {
  createCity()
}

import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./App.css";

/**
 * 函数式组件
 * @returns
 */
function App() {
  useEffect(() => {
    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 使用渲染器，通过相机将场景渲染进来
    document.body.appendChild(renderer.domElement);

    // 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    // 将网格添加到场景中
    scene.add(cube);
    // 设置相机位置
    camera.position.z = 5;
    camera.position.y = 2;
    camera.position.x = 2;
    camera.lookAt(0, 0, 0);

    // 添加世界坐标辅助器
    // 线段长度为5
    // 蓝色Z轴正对我们，看不到
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 添加轨道控制器
    // 监听了canvas的事件，控制相机
    // renderer.domElement监听的是canvas事件，canvas可能被挡住，允许更换dom对象
    // const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, document.body);
    // 设置带阻尼的惯性，会慢慢停下来
    controls.enableDamping  = true
    // 设置阻尼系数
    controls.dampingFactor = 0.05 
    // 设置旋转速度
    controls.autoRotate = true

    // 渲染函数
    function animate() {
      controls.update()
      requestAnimationFrame(animate);
      // 旋转
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return (
    <>
      <div className="App"></div>
    </>
  );
}

export default App;

import { useEffect, useState, Component } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as THREE from "three";
import "./App.css";

// function App() {
//   useEffect(() => {
//     // 创建场景
//     const scene = new THREE.Scene();
//     // 创建相机
//     const camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );

//     // 创建渲染器
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     // 使用渲染器，通过相机将场景渲染进来
//     document.body.appendChild(renderer.domElement);

//     // 创建几何体
//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const cube = new THREE.Mesh(geometry, material);
//     // 将网格添加到场景中
//     scene.add(cube);
//     camera.position.z = 5;
//     camera.lookAt(0, 0, 0);
//     // 渲染函数
//     function animate() {
//       requestAnimationFrame(animate);
//       // 旋转
//       cube.rotation.x += 0.01;
//       cube.rotation.y += 0.01;
//       renderer.render(scene, camera);
//     }
//     animate();
//   }, []);

//   return (
//     <>
//       <div className="App"></div>
//     </>
//   );
// }

/**
 * 类式组件
 */
class App extends Component {
  render() {
    return <div></div>;
  }
  componentDidMount(): void {
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
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    // 渲染函数
    function animate() {
      requestAnimationFrame(animate);
      // 旋转
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }
}

export default App;

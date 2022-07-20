[TOC]



## 1. Three.js入门

### GSAP 组件动画

```
npm install gsap
```

### 根据尺寸变化实现自适应画面

```javascript
// 监听画面变化，更新渲染画面

window.addEventListener("resize", () => {

 // 更新摄像头

 camera.aspect = window.innerWidth / window.innerHeight;

 // 更新摄像机的投影矩阵

 camera.updateProjectionMatrix()

 // 更新渲染器

 renderer.setSize(window.innerWidth, window.innerHeight)

 // 设置渲染器的像素比

 renderer.setPixelRatio(window.devicePixelRatio)

});
```

### 应用图形用户界面更改变量 - GUI库

```javascript
npm install --save dat.gui
```

### Three.js中透视投影照相机PerspectiveCamera

照相机不断的拍摄我们创建好的场景，然后通过渲染器渲染到屏幕中，最后在屏幕中展现出创建的3d场景

但是如果我们想看到我们创建场景中更多的视野的时候，可以通过不断的移动照相机来实现，如果一定要拿某一样东西来比喻，那用我们的眼睛是再适合不过的了

正投影相机OrthographicCamera和透视投影相机PerspectiveCamera。
透视投影照相机对应投影到的物体的大小是随着距离逐渐变小的
正投影照相机投影到的物体大小是不受距离影响的。

透视投影相机解析：

https://www.cnblogs.com/gaozhiqiang/p/11551161.html

```javascript
// 四个参数
// fov - 摄像机视锥体垂直视野角度，最小值为0，最大值为180，默认值为50，实际项目中一般都定义45，因为45最接近人正常睁眼角度
// aspect - 表示摄像机视锥体长宽比，默认长宽比为1，即表示看到的是正方形，实际项目中使用的是屏幕的宽高比
// near - 摄像机视锥体近端面，这个值默认为0.1，实际项目中都会设置为1
// far - 摄像机视锥体远端面，默认为2000，这个值可以是无限的，说的简单点就是我们视觉所能看到的最远距离。
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight/window.innerHeight,
  0.1,
  1000
)
```

## 2. 全面认识threejs物体




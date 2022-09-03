[TOC]

## 1. Parcel

```
npm install parcel-bundler --save-dev
```



## 2. Three.js入门

http://www.webgl3d.cn/threejs/docs/

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

## 3. 全面认识threejs物体

ConeGeometry

https://threejs.org/docs/index.html?q=ConeGe#api/en/geometries/ConeGeometry



创建缓冲区属性对象
传进去顶点一维数组，每三个值作为一个坐标
new THREE.BufferAttribute()



## 4. 材质

设置顶点越多性能消耗越大
.magFiltetr
当一个纹素覆盖大于一个像素
.minFilter
当一个纹素覆盖小于一个像素

在纹理放大时，需要为任何像素查找的纹素的数量总是四个或更少; 然而，在缩小时，随着纹理多边形移动得更远，潜在地整个纹理可能落入单个像素中。这将需要阅读所有它的纹素和它们的值组合以正确地确定像素颜色，这是一个非常昂贵的操作。Mipmapping通过预先过滤纹理并将其以较小的尺寸存储到单个像素来避免这种情况。随着纹理表面移动得更远，应用的纹理切换到预过滤的较小尺寸。mipmap的不同大小被称为“级别”，级别0是最大的级别（最接近观看者），并且随着距离增加，对应要增加mipmap等级。



uv贴图，决定顶点在什么位置



geometry.attributes.uv
决定顶点在uv贴图什么样的位置

给平面创建第二组uv
遮挡贴图，明暗效果比较好

#### PBR渲染
灯光属性
直接照明，间接照明，直接高光，间接高光，阴影，环境光闭塞
表面属性:
基础色，法线，高光，粗糙度，金属度

#### 间接漫反射
来自环境中各个方向的光撞击表面后散落在各个方向
因为计算昂贵
引擎的全局照明解决方案通常会离线渲染，并被烘培成灯光地图

#### 获取纹理贴图的网站

https://www.poliigon.com/textures

https://www.arroway-textures.ch/textures/

Quixel Bridge 虚幻引擎软件

## 5. HDR 

HDR技术是一种改善动态对比度的技术，HDR就是高动态范围技术，如其名字一样，HDR技术增加了亮度范围，同时提升最亮和最暗画面的对比度，从而获得更广泛的色彩范围，除了明显改善灰阶，也带来了更黑或更白的颜色效果。这样用户就可以看到更多的细节



## 6. 点光源聚光灯

点光源 - 向四周发散灯光

聚光灯 - 手电筒

## 7. 粒子特效

https://kenney.nl/assets/particle-pack

## 8. 三维物理引擎

cannon-es

https://pmndrs.github.io/cannon-es/

文档：

https://schteppe.github.io/cannon.js/docs/

碰撞监测

## 9. WEBGL

### 简介

(Web图形库)JavaScript API， 可在兼容的WebL浏览器中渲染高性能的交互式3D和2D图形，无需使用插件

### 渲染管线

Webgl的渲染依赖底层GPU的渲染能力，所以WEBGL渲染流程和GPU内部的渲染管线相符

作用：

将3D模型转换为二维图像

![](E:\Bella\Study\threejs_basic\screenshot\1660635977455.jpg)

![image-20220816154806192](E:\Bella\Study\threejs_basic\screenshot\image-20220816154806192.png)



![image-20220816161647055](E:\Bella\Study\threejs_basic\screenshot\image-20220816161647055.png)

### 图元

描述各种图形元素的函数，描述几何元素的称为几何图元（点，线段或多边形）

经过顶点着色器计算之后的坐标会被组装成**组合图元**

1. 图元装配

   将设置的顶点，颜色，纹理等内容组装成一个可渲染的多边形的过程

2. 光栅化

   通过图元装配生成的多边形，计算像素并填充，剔除不可见的部分，剪裁掉不在可视范围内的部分

3. 剔除和剪裁

### 片元着色器

#### 片元 

光栅化后，每一个像素点都包含了颜色，深度，纹理数据

每个像素的颜色由片元着色器的 gl_FragColor提供

![image-20220816194935902](E:\Bella\Study\threejs_basic\screenshot\image-20220816194935902.png)

模板测试： 模拟观察者的观察行为，模拟如何看像素

#### 生成三角形

![image-20220817084047681](E:\Bella\Study\threejs_basic\screenshot\image-20220817084047681.png)

#### 百叶窗

反复渐变效果

旗子晃动

shader效果：

https://www.shadertoy.com/

## 10. 环境纹理

```javascript
//13_extendedMaterial
// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/0/px.jpg",
  "textures/environmentMaps/0/nx.jpg",
  "textures/environmentMaps/0/py.jpg",
  "textures/environmentMaps/0/ny.jpg",
  "textures/environmentMaps/0/pz.jpg",
  "textures/environmentMaps/0/nz.jpg",
]);

scene.environment = envMapTexture;
scene.background = envMapTexture;


```


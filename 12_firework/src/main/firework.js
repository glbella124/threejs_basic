import * as Three from "three";
import startPointFragment from "../shader/startpoint/fragment.glsl";
import startPointVertex from "../shader/startpoint/vertex.glsl";
import fireworksFragment from "../shader/fireworks/fragment.glsl";
import fireworksVertex from "../shader/fireworks/vertex.glsl";

// AudioListener -- 用一个虚拟的listener在场景中所有位置和非位置相关的音效
// 多数情况下，listener是camera的子对象，Camerade的3D变换表示了listener的3D变换

export default class Fireworks {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    //设置烟花颜色
    this.color = new Three.Color(color);

    // 创建烟花发射的球点
    this.startGeometry = new Three.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new Three.BufferAttribute(startPositionArray, 3)
    );

    // 烟花矢量路线
    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.z;
    this.startGeometry.setAttribute(
      "aStep",
      new Three.BufferAttribute(astepArray, 3)
    );

    // 设置着色器材质
    this.startMaterial = new Three.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: Three.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: { value: this.color },
      },
    });

    // 创建烟花点球
    this.startPoint = new Three.Points(this.startGeometry, this.startMaterial);
    // 开始计时
    this.clock = new Three.Clock();

    // 创建爆炸的烟花
    this.fireworkGeometry = new Three.BufferGeometry();
    // 烟花点 180 -- 360 floor(向下取整)
    this.fireworkCount = 180 + Math.floor(Math.random() * 180);
    // 位置数组
    const positionFireworksArray = new Float32Array(this.fireworkCount * 3);
    // 大小
    const scaleFireArray = new Float32Array(this.fireworkCount);
    // 方向
    const directionArray = new Float32Array(this.fireworkCount * 3);
    for (let i = 0; i < this.fireworkCount; i++) {
      // 初始化爆炸烟花位置
      positionFireworksArray[i * 3 + 0] = to.x;
      positionFireworksArray[i * 3 + 1] = to.y;
      positionFireworksArray[i * 3 + 2] = to.z;

      // 初始化所有粒子大小
      scaleFireArray[i] = Math.random();

      // 设置烟花向四周发射的角度
      // 经纬度 -- 水平方向，垂直方向
      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();

      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);
    }

    this.fireworkGeometry.setAttribute(
      "position",
      new Three.BufferAttribute(positionFireworksArray, 3)
    );
    // 大小
    this.fireworkGeometry.setAttribute(
      "aScale",
      new Three.BufferAttribute(scaleFireArray, 1)
    );
    // 随机方向
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new Three.BufferAttribute(directionArray, 3)
    );

    this.fireworksMaterial = new Three.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        // 设置爆炸烟花初始大小
        uSize: {
          value: 0,
        },
        uColor: { value: this.color },
      },
      transparent: true,
      blending: Three.AdditiveBlending,
      depthWrite: false,
      vertexShader: fireworksVertex,
      fragmentShader: fireworksFragment,
    });

    this.fireworks = new Three.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );

    // 创建音效
    this.listener = new Three.AudioListener();
    this.sound = new Three.Audio(this.listener);
    this.sendSound = new Three.Audio(this.listener);
    // 创建音频加载器
    const audioLoader = new Three.AudioLoader();
    audioLoader.load(
      `./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(0.6);
      }
    );

    audioLoader.load(`./assets/audio/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(0.8);
    });
  }

  // 添加到场景
  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }

  // 变量更新
  update() {
    const elapsedTime = this.clock.getElapsedTime();

    // 设置延时
    if (elapsedTime > 0.2 && elapsedTime < 1) {
      // 烟花发射声音
      if (!this.sendSound.isPlaying && !this.sendSoundPlay) {
        this.sendSound.play();
        this.sendSoundPlay = true;
      }

      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else if(elapsedTime>0.2) {
      const time = elapsedTime - 1;
      // 初始点尺寸设置为0
      this.startMaterial.uniforms.uSize.value = 0;
      // 点清除
      this.startPoint.clear();
      // 从内存清除
      this.startGeometry.dispose();
      // 材质清除
      this.startMaterial.dispose();

      // 没有播放 -- 烟花爆炸声音
      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }

      // 设置烟花显示
      this.fireworksMaterial.uniforms.uSize.value = 20;
      this.fireworksMaterial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireworksMaterial.uniforms.uSize.value = 0;
        this.fireworks.clear();
        this.fireworkGeometry.dispose();
        this.fireworksMaterial.dispose();
        // 从当前对象子集中移除对象
        this.scene.remove(this.fireworks);
        this.scene.remove(this.startPoint);
        return "remove";
      }
    }
  }
}

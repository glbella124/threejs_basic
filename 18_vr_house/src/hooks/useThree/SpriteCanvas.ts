import * as THREE from "three";
export default class SpriteCanvas {
  fns: any;
  context: any;
  mesh: any;
  raycaster: any;
  mouse: any;

  constructor(
    camera: any,
    text: any="hello",
    position: number[] = [0, 0, 0],
    // euler: any = new THREE.Euler(0, 0, 0)
  ) {
    this.fns = [];
    // 创建canvas对象
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context: any = canvas.getContext("2d");
    this.context = context;
    context.fillStyle = "rgba(100,100,100,1)";
    context.fillRect(0, 256, 1024, 512);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 200px Arial";
    context.fillStyle = "rgba(255,255,255,1)";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      alphaMap: texture,
      side: THREE.DoubleSide,
      transparent: true,
      // blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Sprite(material);
    // this.mesh.scale.set(0.5, 0.5, 0.5);
    this.mesh.position.copy(new THREE.Vector3(...position));

    // 创建射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 事件的监听
    window.addEventListener("click", (event:any) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  
        this.raycaster.setFromCamera(this.mouse, camera);
  
        event.mesh = this.mesh;
        event.spriteCanvas = this;
  
        // console.log(this.mouse);
        const intersects = this.raycaster.intersectObject(this.mesh);
        // console.log(intersects);
        if (intersects.length > 0) {
          this.fns.forEach((fn:any) => {
            fn(event);
          });
        }
      });
  }

  onClick(fn:any){
    this.fns.push(fn);
  }
}

// 顶点着色器
attribute float aSize;

uniform float uTime;
// 三维颜色向量

uniform float uLength;
varying float vSize;

// 类型彗星效果(第一段和第二段之间有空隙)
void main() {
    // 视线位置
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
    gl_Position = projectionMatrix * viewPosition;
    // 小于0设置透明
    vSize = aSize - uTime;
    if(vSize<0.0){
        vSize = vSize + uLength;
    }
    vSize = (vSize-500.0)*0.1;
    // 设置近大远小 -- 是否远离摄像机 viewPosition.z负值，负负得正
    gl_PointSize = -vSize/viewPosition.z;
}

// 飞线中间不中断
// void main() {
//     // 视线位置
//     vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
//     gl_Position = projectionMatrix * viewPosition;
//     // 小于0设置透明
//     vSize = aSize- 100.0 - uTime;
//     if(vSize<0.0){
//         vSize = vSize + uLength;
//     }
//     vSize = vSize*0.1;
//     // 设置近大远小 -- 是否远离摄像机 viewPosition.z负值，负负得正
//     gl_PointSize = -vSize/viewPosition.z;
// }
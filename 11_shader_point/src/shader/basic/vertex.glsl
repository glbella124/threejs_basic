
varying vec2 vUv;

attribute float imgIndex;
attribute float aScale;
varying float vImgIndex;

uniform float uTime;

varying vec3 vColor;

void main() {
    // position三维的，再加一个齐数，变四维
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // viewMatrix -- 视点矩阵

    

    // 获取定点的角度
    float angle = atan(modelPosition.x, modelPosition.z);
    // 获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    // 根据顶点到中心的距离，设置旋转偏移度数
    float angleOffset = 1.0 / distanceToCenter * uTime;
    angle += angleOffset;
    // x方向位置
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // 根据viewPosition的z坐标设置顶点大小，决定是否远离摄像机
    // 设置点的大小
    // gl_PointSize = 40.0;
    // 距离越近正，越远负
    gl_PointSize = 40.0 / -viewPosition.z * aScale;
    vUv = uv;
    // 能够获取到属性
    // geometry.setAttribute("imgIndex"
    vImgIndex = imgIndex;
    vColor = color;
}
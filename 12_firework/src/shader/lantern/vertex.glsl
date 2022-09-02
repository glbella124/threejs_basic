precision lowp float;

// 传给片元着色器
// 设置一个位置变量控制位置
varying vec4 vPosition;
// 局部位置
varying vec4 gPosition;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vPosition = modelPosition;
    gPosition = vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
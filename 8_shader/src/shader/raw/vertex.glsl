// 不需要非常好的效果，精度允许调低
// highp  -2^16 -- 2^16
// mediump -2^10 -- 2^10
// lowp    -2^8 -- 2^8
precision lowp float;

attribute vec3 position;
// 传递属性uv
attribute vec2 uv;

// 四维矩阵
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

// 获取时间
uniform float uTime;

// uv数据可以传递给片元着色器
varying vec2 vUv;
varying float vElevation;

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // 偏移
    // modelPosition.x += 1.0;

    // 倾斜效果
    // modelPosition.z += modelPosition.x;

    // 波浪
    // 顶点越细，波浪曲线越明显
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
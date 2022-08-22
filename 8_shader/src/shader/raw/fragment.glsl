precision lowp float;

varying vec2 vUv;
varying float vElevation;

// 设置采样纹理
uniform sampler2D uTexture;

void main() {
    // 使用二维向量填充
    // gl_FragColor = vec4(vUv,0.0,1.0);

    // 颜色渐变效果 
    // float height = vElevation + 0.05 * 10.0;
    // gl_FragColor = vec4(1.0 * height, 0.0, 0.5, 1.0);

    // 根据uv取色
    float height = vElevation + 0.05 * 15.0;
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= height;
    gl_FragColor = textureColor;
}
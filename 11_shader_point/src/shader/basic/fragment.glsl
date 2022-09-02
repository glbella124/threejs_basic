precision lowp float;

varying vec2 vUv;
varying vec3 vColor;
// 纹理采样
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying float vImgIndex;

void main() {
    // gl_PointCoord -- 在点渲染模式中，对应方形像素坐标
    // gl_FragCoord -- 片元的坐标，同样是以像素为单位
    // https://www.yuque.com/books/share/aa187c93-6603-453e-9377-9a935b59aeb4/hrzh3y

    // 设置渐变圆 -- 模拟星星
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength*=2.0;
    // strength = 1.0 - strength;
    // gl_FragColor = vec4(strength);

    // 圆形点
    // float strength = 1.0 - distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5,strength);
    // gl_FragColor = vec4(strength);

    // 根据传入的纹理设置图案
    // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
    // gl_FragColor = vec4(textureColor.rgb,textureColor.r);

    // 根据纹理设置图案 -- 彩色
    vec4 textureColor;
    if(vImgIndex == 0.0) {
        textureColor = texture2D(uTexture, gl_PointCoord);
    } else if(vImgIndex == 1.0) {
        textureColor = texture2D(uTexture1, gl_PointCoord);
    } else {
        textureColor = texture2D(uTexture2, gl_PointCoord);

    }
    gl_FragColor = vec4(vColor, textureColor.r);

}
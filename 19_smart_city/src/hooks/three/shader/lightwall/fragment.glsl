// 定义位置变量方便传给片元着色器
varying vec3 vPosition;
uniform float uHeight;
uniform vec3 uColor;
void main(){
    // 设置混合的百分比
        float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
      gl_FragColor = vec4(uColor,1.0-gradMix);
    
}
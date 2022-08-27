precision lowp float;

varying vec4 vPosition;
varying vec4 gPosition;

void main() {
    // 设置渐变色
    vec4 redColor = vec4(1, 0, 0, 1);
    vec4 yellowColor = vec4(1, 1, 0.5, 1);
    vec4 mixColor = mix(yellowColor, redColor, gPosition.y / 3.0);

     // 判断正面还是反面
    if(gl_FrontFacing) {
        // 飞的越高值越小
        gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/90.0-0.1, 1.0);
    }else{
        gl_FragColor = vec4(mixColor.xyz,1.0);
    }
}
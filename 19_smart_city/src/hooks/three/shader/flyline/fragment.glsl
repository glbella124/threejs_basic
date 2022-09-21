// 片元着色器
uniform vec3 uColor;

varying float vSize;
void main() {
    // 距离中心的距离
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = 1.0 - (distanceToCenter*2.0);
    // 小于0 -- 设置透明
    if(vSize <= 0.0) {
        gl_FragColor = vec4(1,0,0,0);
    }else{
        gl_FragColor = vec4(uColor,strength);
    }

}
precision lowp float;
uniform float uTime;
uniform float uScale;
// 从顶点着色器传过来的
varying vec2 vUv;

#define PI 3.1415926

// 随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 旋转函数
// uv; rotation -- 旋转角度; mid -- 中心点
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}


//噪声函数 
// https://thebookofshaders.com/13/?lan=ch
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// 柏林噪声模式
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}



void main() {
    // 通过顶点对应的uv,决定每一个像素在uv图像的位置，通过这个位置x,y决定颜色
    // gl_FragColor = vec4(vUv,0.0, 1.0);

    // 2 --- 变形
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // 3 --- 利用uv实现渐变效果 -- 从左到右
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 4 --- 利用uv实现渐变效果 -- 从下到上
    // float strength = vUv.y;

    // 5 -- 渐变 -------- 从上到下
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 6 -- 百叶窗效果 -- 反复渐变 
    // 通过取模达到反复渐变的效果 mod -- 取余
    // float strength = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 7 -- 斑马线效果 -- 反复渐变 
    // step(edge,x) 如果x<edge,返回0.0,否则返回1.0
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.6,strength);
    // gl_FragColor = vec4(strength, strength, strength, 1); 

    // 8 -- 红竖条纹相加 -- 
    // float strength = step(0.7,mod(vUv.x * 10.0, 1.0));
    // 相加 , 相减, 相乘均可以呈现不同条纹
    // strength *= step(0.7,mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 9 ------- 瓷砖地板
    // float strength = step(0.2,mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.2,mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 10 ------- 横竖条纹叠加
    // float barX = step(0.4,mod(vUv.x * 10.0, 1.0)) * step(0.8,mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4,mod(vUv.y * 10.0, 1.0)) * step(0.8,mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength,strength,strength,1);
    // 有颜色 
    // gl_FragColor = vec4(vUv,1,strength);

     // 11 ------- 运动的条纹 + uTime
    // float barX = step(0.4,mod((vUv.x + uTime*0.1) * 10.0, 1.0)) * step(0.8,mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4,mod((vUv.y + uTime*0.1) * 10.0, 1.0)) * step(0.8,mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 12 --------  T型图
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 13 --------  利用绝对值 -- 左右对称
    // float strength = abs(vUv.x - 0.5);
    // float strength = abs(vUv.y - 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 14 --------  绝对值，x + y
    // 十字最暗
    // float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
    // 对角线最暗，其余亮一些
    // float strength = max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
    // 对角线最亮，其余暗
    // float strength = 1.0 - max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 15 --------- step(小于0.2 = 0， 大于0.2 = 1)
    // 中间暗方形，四周亮; 中间亮，四周暗
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = 1.0 - step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 16 ---------- 利用取整实现阶段性的条纹渐变 (floor -- 向下取整)
    // 水平条纹，垂直条纹，相乘条纹
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // float strength = floor(vUv.y * 10.0) / 10.0;
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 17 -----------  向上取整
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 18 -----------   随机效果
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength,strength,strength,1); 

    // 19 -----------  随机 + 格子效果 (马赛克)
    // float strength = ceil(vUv.x*10.0)/10.0 * ceil(vUv.y*10.0)/10.0;
    // strength = random(vec2(strength,strength));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 20 -----------  依据length返回向量长度(左下角原点开始变化)
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 21 -----------  根据distance计算两个向量的距离(黑洞)
    // float strength = distance(vUv,vec2(0.5,0.5));
    // float strength = 1.0 - distance(vUv,vec2(0.5,0.5));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 22 -----------  星星效果(中间很亮，快速衰减)
    // float strength = 0.15/distance(vUv, vec2(0.5, 0.5))-1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 23 -----------  设置vUv水平或者竖直变量
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y-0.5)*2.0), vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 24 -----------  十字交叉的星星
    // float strength1 = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // float strength2 = 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // float strength = strength1 + strength2;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 25 ----------  旋转飞镖，旋转uv
    // vec2 rotationUv = rotate(vUv, 3.14 * 0.25, vec2(0.5));
    // vec2 rotationUv = rotate(vUv, uTime, vec2(0.5));
    // float strength1 = 0.15 / distance(vec2(rotationUv.x, (rotationUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // float strength2 = 0.15 / distance(vec2(rotationUv.y, (rotationUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // float strength = strength1 + strength2;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 26 ---------- 中心黑圆
    // float strength = step(0.5,distance(vUv,vec2(0.5))+0.25);
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 27 ----------  绘制圆
    // float strength = 1.0 - step(0.5,distance(vUv,vec2(0.5))+0.15);
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 28 ----------  绘制圆环 
    // float strength = step(0.5,distance(vUv,vec2(0.5))+0.25);
    // strength *= (1.0 - step(0.5,distance(vUv,vec2(0.5))+0.15));
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 29 ----------  渐变环
    // float strength = abs(distance(vUv,vec2(0.5))-0.25);
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 30 ---------- 打靶
    // float strength = step(0.1, abs(distance(vUv, vec2(0.5)) - 0.25));
    // float strength = 1.0 - step(0.1, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 31 ---------- 波浪怪物
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y *30.0 + uTime)*0.1,
    //     vUv.y + sin(vUv.x*30.0 + uTime)*0.1
    // );
    // float strength = 1.0 - step(0.02, abs(distance(waveUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 32 ---------- 根据角度显示视图 atan -- 反正切
    // float angle = atan(vUv.x,vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 33 ---------- 根据角度实现螺旋渐变
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // float strength = (angle + 3.14)/6.28;
    // gl_FragColor = vec4(strength,strength,strength,1);


    // 34 ---------- 雷达扫射旋转效果
    // vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
    // float alpha = 1.0 - step(0.5,distance(vUv,vec2(0.5)));
    // float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
    // float strength = (angle + 3.14)/6.28;
    // gl_FragColor = vec4(strength,strength,strength,alpha);

    // 35 --------- 万花筒
    // float angle = atan(vUv.x-0.5,vUv.y-0.5)/(PI*2.0);
    // float strength = mod(angle*10.0, 1.0);
    // float strength = sin(angle*100.0);
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 36 --------- 使用噪声函数实现烟雾波纹效果 noise(
    // float strength = step(0.5,noise(vUv * 50.0));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 37 --------- 柏林噪声模式
    // float strength = step(uScale,cnoise(vUv * 10.0 + uTime));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 38 --------- 取绝对值，有陆地环绕效果(发光效果)
    // float strength = 1.0 - abs(cnoise(vUv*10.0+uTime));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 39 --------- sin函数下的波纹效果(黑白相间)
    // float strength = 1.0 - sin(cnoise(vUv*10.0)*10.0+uTime);
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 40 --------- sin函数下的波纹效果(黑白相间) -- 锐化效果
    // float strength = step(0.9,sin(cnoise(vUv*10.0)*10.0+uTime)) ;
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 41 --------- 使用混合函数混合颜色，波纹
    // vec3 black = vec3(0.0,0.0,0.0);
    // vec3 purple = vec3(1.0,0.5,1.0);
    // float strength = step(0.9,sin(cnoise(vUv*10.0)*10.0+uTime)) ;
    // mix(x, y, a)
    // 返回线性混合的x和y，如：x*(1−a)+y*a -- 混合颜色
    // vec3 mixColor = mix(black,purple,strength);
    // gl_FragColor = vec4(mixColor,1.0);

    // 42 --------- 使用uv颜色混合
    // 蓝紫混合
    vec3 uvColor = vec3(vUv,1.0);
    // 红黄混合
    // vec3 uvColor = vec3(1.0,vUv);
    float strength = step(0.9,sin(cnoise(vUv*10.0)*10.0+uTime));
    vec3 mixColor = min(uvColor,strength);
    gl_FragColor = vec4(mixColor,1.0);


    

}
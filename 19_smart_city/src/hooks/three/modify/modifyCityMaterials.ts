import * as THREE from "three";
import gsap from "gsap";

/**
 * modifyCityMaterial
 * 更改着色器内容
 * 修改建筑模型底色
 * @param mesh
 */

export default function modifyCityMaterial(mesh: any) {
  mesh.material.onBeforeCompile = (shader: any) => {
    // 结束处替换
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
            #include <dithering_fragment>
            // #end#
            `
    );

    addGradColor(shader, mesh);
    addSpread(shader);
    addLightLine(shader);
    addToTop(shader);
  };
}

// 设置渐变色
export function addGradColor(shader: any, mesh: any) {
  // 计算后获取Bounding最大最小值
  mesh.geometry.computeBoundingBox();
  let { min, max } = mesh.geometry.boundingBox;
  //   获取物体高度差
  let uHeight = max.y - min.y;

  // console.log(shader.vertexShader);
  // console.log(shader.fragmentShader);
  // 深紫色渐变到淡紫色
  shader.uniforms.uTopColor = {
    value: new THREE.Color("#E0B0FF"),
  };
  shader.uniforms.uHeight = {
    value: uHeight,
  };

  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `
        #include <common>
        varying vec3 vPosition;
        `
  );
  // 传进来顶点位置
  shader.vertexShader = shader.vertexShader.replace(
    `#include <begin_vertex>`,
    `
        #include <begin_vertex>
        vPosition = position;
        `
  );

  // common -- 定义统一变量
  shader.fragmentShader = shader.fragmentShader.replace(
    `#include <common>`,
    `
        #include <common>
        uniform vec3 uTopColor;
        uniform float uHeight;
        varying vec3 vPosition;
        `
  );
  // 在结尾处追加顶点颜色
  shader.fragmentShader = shader.fragmentShader.replace(
    `// #end#`,
    `
        #include <dithering_fragment>
        vec4 distGradColor = gl_FragColor;
  
        // 设置混合的百分比 -- 保证是正值
        float gradMix = (vPosition.y + uHeight/2.0)/uHeight;
        // 计算出混合颜色
        vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
        gl_FragColor = vec4(gradMixColor,1);
        // #end#
        `
  );
}

/**
 * addSpread
 * 从中心点向外扩散的效果,按照长度半径不断向外围扩散,
 * 以临界值为基准，大于临界值，按高亮显示
 * @param shader
 */
// 设置扩散 -- 中心点可设置
export function addSpread(shader: any) {
  // 设置扩散的二维中心点
  shader.uniforms.uSpreadCenter = { value: new THREE.Vector2(0, 0) };
  // 扩散的时间
  shader.uniforms.uSpreadTime = { value: 0 };
  // 设置条带的宽度
  shader.uniforms.uSpreadWidth = { value: 40 };
  shader.fragmentShader = shader.fragmentShader.replace(
    `#include <common>`,
    `
    #include <common>
    uniform vec2 uSpreadCenter;
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
    `
  );
  //   找到结尾处的位置
  shader.fragmentShader = shader.fragmentShader.replace(
    `// #end#`,
    `
    float spreadRadius = distance(vPosition.xz,uSpreadCenter);
    // 扩散范围的函数 y = -x^2
    float spreadIndex = -(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;
    // 大于0的颜色混合
    if(spreadIndex>0.0){
        gl_FragColor  = mix(gl_FragColor,vec4(1.0,1.0,1.0,1),spreadIndex/uSpreadWidth);
    }

    // #end#
    `
  );

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 300,
    duration: 3,
    ease: "none",
    repeat: -1,
  });
}

/**
 * addLightLine
 * 水平运动的光带
 * @param shader
 */
export function addLightLine(shader: any) {
  shader.uniforms.uLightLineTime = { value: -1500 };
  shader.uniforms.uLightLineWidth = { value: 200 };

  // 设置条带的宽度
  shader.fragmentShader = shader.fragmentShader.replace(
    `#include <common>`,
    `
    #include <common>
    uniform float uLightLineTime;
    uniform float uLightLineWidth;
    `
  );
  //   找到结尾处的位置
  shader.fragmentShader = shader.fragmentShader.replace(
    `// #end#`,
    `
    // 扩散范围的函数 y = -x^2
    float lightLineMix = -(vPosition.x+vPosition.z-uLightLineTime)*(vPosition.x+vPosition.z-uLightLineTime)+uLightLineWidth;
    // 大于0的颜色混合
    if(lightLineMix>0.0){
        gl_FragColor  = mix(gl_FragColor,vec4(0.95,0.96,0.0,1),lightLineMix/uLightLineWidth);
    }

    // #end#
    `
  );
  // 大于0 -- 进行从左到右的水平扫描
  gsap.to(shader.uniforms.uLightLineTime, {
    value: 800,
    duration: 4,
    ease: "none",
    repeat: -1,
  });
}

/**
 * addToTop
 * 向上扫描
 * @param shader
 */
export function addToTop(shader: any) {
  shader.uniforms.uToTopTime = { value: 0 };
  shader.uniforms.uToTopWidth = { value: 50 };

  // 设置条带的宽度
  shader.fragmentShader = shader.fragmentShader.replace(
    `#include <common>`,
    `
      #include <common>
      uniform float uToTopTime;
      uniform float uToTopWidth;
      `
  );
  //   找到结尾处的位置
  shader.fragmentShader = shader.fragmentShader.replace(
    `// #end#`,
    `
      // 扩散范围的函数 y = -x^2
      float toTopMix = -(vPosition.y-uToTopTime)*(vPosition.y-uToTopTime)+uToTopWidth;
      // 大于0的颜色混合
      if(toTopMix>0.0){
          gl_FragColor  = mix(gl_FragColor,vec4(0.5,1.0,1.0,1),toTopMix/uToTopWidth);
      }
  
      // #end#
      `
  );
  // 大于0 -- 进行从左到右的水平扫描
  gsap.to(shader.uniforms.uToTopTime, {
    value: 200,
    duration: 3,
    ease: "none",
    repeat: -1,
  });
}

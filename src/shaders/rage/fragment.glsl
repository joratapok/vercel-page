uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uColor;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionLight.glsl
#include ../includes/pointLight.glsl

void main() {
    // Base Color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Light
    // vNormal может быть меньше 1, поэтому нужно их переномализировать!!
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 light = vec3(0.0);

    light += pointLight(
        vec3(1.0),           // Light color
        10.0,                  // LIght intencity
        normal,               // normal
        vec3(0.0, 0.25, 0.0),  // light postion
        viewDirection,        // normalized view direction
        30.0,                 // specular power
        vPosition,            // position
        0.95                // position
    );

    vec3 finalColor = mixedColor * light;

    // Туман
//    // Расстояние от камеры до фрагмента
//    float depth = distance(vPosition, cameraPosition);
//
//    // Коэффициент тумана: 0 = нет тумана, 1 = полностью туман
//    float fogFactor = smoothstep(fogNear, fogFar, depth);
//
//    // Смешиваем цвет с туманом
//    vec3 finalColor = mix(mixedColor, fogColor, fogFactor);

    // Final color
//    gl_FragColor = vec4(mixedColor, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

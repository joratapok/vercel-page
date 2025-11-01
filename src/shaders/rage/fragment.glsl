uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying float vElevation;
varying vec3 vWorldPosition;

void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Расстояние от камеры до фрагмента
    float depth = distance(vWorldPosition, cameraPosition);

    // Коэффициент тумана: 0 = нет тумана, 1 = полностью туман
    float fogFactor = smoothstep(fogNear, fogFar, depth);

    // Смешиваем цвет с туманом
    vec3 finalColor = mix(mixedColor, fogColor, fogFactor);

    gl_FragColor = vec4(finalColor, 1.0);
}

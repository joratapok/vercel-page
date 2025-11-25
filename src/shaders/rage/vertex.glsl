uniform float uTime;
uniform vec2 uFrequency;
uniform float uElevation;
uniform float uWaveSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/perlinClassic3D.glsl

float waveElevation(vec3 position) {
    float elevation = sin(position.x * uFrequency.x - (uTime * uWaveSpeed)) *
    sin(position.z * uFrequency.y - (uTime * uWaveSpeed)) *
    uElevation;

    for (float i = 1.0; i <= uSmallIterations; i++) {
        elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * (uSmallWavesElevation / i));
    }
    return elevation;
}

void main() {
    // Base position
    float shift = 0.01;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

    // Elevation
    float elevation = waveElevation(modelPosition.xyz);
    modelPosition.y += elevation;
    modelPositionA.y += waveElevation(modelPositionA);
    modelPositionB.y += waveElevation(modelPositionB);

    // Compute normal
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computeNormal = cross(toA, toB);

    // Filal position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Varyings
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vElevation = elevation;
    vNormal = computeNormal;
    vPosition = modelPosition.xyz;
}

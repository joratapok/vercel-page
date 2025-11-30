uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ./random2D.glsl

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Noize моя реализация
//    float term5s = mod(uTime * 0.001, 4.0);
//    float yPlace = abs(1.0 + modelPosition.y - term5s);
//    float yStrength = yPlace * (1.0 - step(0.2, yPlace));
//    float randomValue = (0.5 - random2D(modelPosition.xz)) * 2.0;
//    modelPosition.x += randomValue * yStrength * 2.0;
//    modelPosition.z += randomValue * yStrength * 2.0;

    // Bald guy
    float glichTime = uTime * 0.001 - modelPosition.y;
    float glichStrength = sin(glichTime) + sin(glichTime * 3.45) + sin(glichTime * 8.76);
//    glichStrength /= 3.0;
    glichStrength = smoothstep(0.3, 1.0, glichStrength);
    glichStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glichStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glichStrength;

    //Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    //Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}

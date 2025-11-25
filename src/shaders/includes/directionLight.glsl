vec3 directionalLight(
    vec3 lightColor,
    float intencity,
    vec3 vNormal,
    vec3 lightPostion,
    vec3 viewDirection,
    float specularPower
) {
    vec3 lightDirection = normalize(lightPostion);
    vec3 lightReflection = reflect(lightDirection, vNormal);

    // shading
    float shading = dot(vNormal, lightDirection);
    shading = max(0.0, shading);

    // * Считаем отражение
    // * lightReflection - с помощью встроенной ф-ии reflect определяем вектор отраженного света
    // * потом получаем скаляр между вектором из камеры и отраженным светом
    // * если они параллельны - бинго
    // */

    // specular
    float specular = dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return lightColor * intencity * (shading + specular);
}

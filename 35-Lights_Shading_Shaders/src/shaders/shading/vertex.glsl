varying vec3 vNormal;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    // Mutiply the normals with the modelMatrix to fix the issue of the light following the object's rotation.
    // Setting the fourth value of the vec4 to 0.0 applies only the rotation and scale, not the translation.
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vNormal = modelNormal.xyz;
}


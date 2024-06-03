varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    // NOTE: When the fourth value is 1.0, the vector is 'homogeneous' and all 3 transformations (translation, rotation, scale) will be applied.
    // When the fourth value is 0.0, the vector is not 'homogeneous' and the translation won't be applied.
    // This is ideal in the case of a normal, because the normal is not a position, it's a direction.
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}

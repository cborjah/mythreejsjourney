uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

float random2D(vec2 value) // Returns a 'random' float from 0.0 to 1.0
{
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch effect
    modelPosition.x += random2D(modelPosition.xz + uTime) - 0.5;
    modelPosition.z += random2D(modelPosition.zx + uTime) - 0.5;

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

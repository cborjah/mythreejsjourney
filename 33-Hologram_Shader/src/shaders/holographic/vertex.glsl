varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = normal;
}

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
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitchStrength /= 3.0; // Since 3 sine functions are added, the value can get quite high (up to 3.0). Divide by 3.0 to bring it back down to 1.0.
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength); // When 'glitchStrength' is below 0.3 you get 0. When the value goes above 0.3, you get a value that starts at 0 and goes up to 1.0.
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

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

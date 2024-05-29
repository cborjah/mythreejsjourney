uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include ../includes/rotate2D.glsl;

void main()
{
    // You cannot directly modify an attribute, use a variable to do this.
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture( // Use the light/dark colors of the texture to set angle value. This adds randomness to the twist.
            uPerlinTexture,
            vec2(0.5, uv.y * 0.2 - uTime * 0.005)
        ).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
            texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
            texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
        );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    newPosition.xz += windOffset;

    // NOTE: The order of matrices is important! Matrices go first, then the variable you want to transform using the matrices.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
}

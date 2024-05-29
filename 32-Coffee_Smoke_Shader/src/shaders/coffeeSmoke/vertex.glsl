uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

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

    // NOTE: The order of matrices is important! Matrices go first, then the variable you want to transform using the matrices.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
}

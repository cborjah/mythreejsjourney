uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main()
{
    // Scale and Animate
    vec2 smokeUv = vUv; // You cannot directly modify a varying variable. Use a new variable to do that.
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r; // Since its a greyscale picture, r,g, and b are the same values. Therefore, only retrieve the 'r' channel.

    // Remap
    smoke = smoothstep(0.4, 1.0, smoke); // smoothstep returns a value from 0 to 1 and it's clamped.

    gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

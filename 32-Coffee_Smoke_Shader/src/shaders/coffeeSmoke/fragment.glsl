uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main()
{
    // Smoke
    float smoke = texture(uPerlinTexture, vUv).r; // Since its a greyscale picture, r,g, and b are the same values. Therefore, only retrieve the 'r' channel.

    gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

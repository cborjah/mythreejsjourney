uniform sampler2D uTexture;
uniform vec3 uColor;

void main()
{
    // NOTE: You don't need 4 channels from the texture because it's a greyscale image. Retrieve the 'r' channel only.
    float textureAlpha = texture(uTexture, gl_PointCoord).r; // The 'texture' function is used to pick pixels from the texture.

    // Final color
    gl_FragColor = vec4(uColor, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

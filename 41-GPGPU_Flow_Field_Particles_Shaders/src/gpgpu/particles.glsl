// This shader is used to update the particles pixels.

void main()
{
    // resolution.xy contains the size of the render.
    // gl_FragCoord.xy is divided using the resolution in order to get 0 to 1 coordinates.
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Pick a pixel from a texture
    // To pick the color from uParticles, use the classic UV coordinates of the plane.
    // Each square of the plane corresponds to one pixel of the uParticles texture, which, itself, corresponds to the coordinates of each pixel.
    // Data is persisting meaning if particle is updated, the updated version will be provided in the next frame allow constant updates.
    vec4 particle = texture(uParticles, uv); // uParticles is the texture that was automatically injected by the GPUComputationRenderer

    gl_FragColor = particle;
}

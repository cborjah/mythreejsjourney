// This shader is used to update the particles pixels.
#include ../shaders/includes/simplexNoise4d.glsl

uniform float uTime;

void main()
{
    float time = uTime * 0.2;

    // resolution.xy contains the size of the render.
    // gl_FragCoord.xy is divided using the resolution in order to get 0 to 1 coordinates.
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Pick a pixel from a texture
    // To pick the color from uParticles, use the classic UV coordinates of the plane.
    // Each square of the plane corresponds to one pixel of the uParticles texture, which, itself, corresponds to the coordinates of each pixel.
    // Data is persisting meaning if particle is updated, the updated version will be provided in the next frame allow constant updates.
    vec4 particle = texture(uParticles, uv); // uParticles is the texture that was automatically injected by the GPUComputationRenderer

    // Flow field
    vec3 flowField = vec3(
            // The fourth value of the vec4 can be used to make the Simplex noise vary in time
            simplexNoise4d(vec4(particle.xyz + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz + 1.0, time)),
            simplexNoise4d(vec4(particle.xyz + 2.0, time))
        );
    flowField = normalize(flowField); // Normalize directions (most of the time)
    particle.xyz += flowField * 0.01;

    gl_FragColor = particle;
}

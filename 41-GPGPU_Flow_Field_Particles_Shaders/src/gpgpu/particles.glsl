// This shader is used to update the particles pixels.
#include ../shaders/includes/simplexNoise4d.glsl

uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;

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
    vec4 base = texture(uBase, uv);

    // Dead particles
    if (particle.a >= 1.0) {
        // Fixing long frames
        // Long frames happen when the computer freezes for a moment or leave the tab.
        // This causes uDeltaTime to become large which triggers all particles to 'die', thus synchronizing them.
        // deltaTime can be clamped (limit to 1/30 of second)
        // OR
        // use modulo 1 when resetting the 'a' channel. If 'a' goes beyond 1.0, it will simply loop back to
        // 0 plus the remainder and never exceed 1.0.
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }
    // Living particles
    else {
        // Flow field
        vec3 flowField = vec3(
                // The fourth value of the vec4 can be used to make the Simplex noise vary in time
                simplexNoise4d(vec4(particle.xyz + 0.0, time)),
                simplexNoise4d(vec4(particle.xyz + 1.0, time)),
                simplexNoise4d(vec4(particle.xyz + 2.0, time))
            );
        flowField = normalize(flowField); // Normalize directions (most of the time)

        // With high-frequency monitors, the particles may die faster.
        // This is because the life is incremented by 0.1 on each frame, regardless of the framerate.
        particle.xyz += flowField * uDeltaTime * 0.5;

        // Use the alpha channel for the life of the particle. The life will decay.
        // Starting from 0.0, it will increase with each frame.
        // Once it reaches 1, it will reset itself to the initial position (0.0)

        // Decay
        particle.a += uDeltaTime * 0.3;
    }

    gl_FragColor = particle;
}

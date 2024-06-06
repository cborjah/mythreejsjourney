uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{
    // Base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength); // Improve gradient's feel by applying a smoothstep.
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}


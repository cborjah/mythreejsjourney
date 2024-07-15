uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;

// Add colors based on elevation
void main()
{
    // Color
    vec3 color = vec3(1.0);

    // Water
    float surfaceWaterMix = smoothstep(-1.0, -0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // Final color
    // NOTE: Update the csm_DiffuseColor, NOT the csm_FragColor.
    // This way all the shading (shadows, relfections, etc.) will be applied.
    csm_DiffuseColor = vec4(color, 1.0);
}

uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;

void main()
{
    // Remap vWobble so that it goes from 0 to 1 instead of -1 to +1
    // and use a smoothstep to smooth the value.
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    // Mirror step
    // csm_Metalness = step(0.25, vWobble); // If vWobble is below 0.25, it returns 0, else it returns 1.
    // csm_Roughness = 1.0 - csm_Metalness;

    // Shiny tip
    csm_Roughness = 1.0 - colorMix;
}

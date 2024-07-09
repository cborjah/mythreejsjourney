uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;

void main()
{
    // Remap vWobble so that it goes from 0 to 1 instead of -1 to +1
    // and use a smoothstep to smooth the value.
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);
}

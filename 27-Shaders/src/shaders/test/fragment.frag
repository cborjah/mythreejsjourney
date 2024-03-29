precision mediump float;

varying float vRandom; // From vertex shader

void main()
{
    gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
}
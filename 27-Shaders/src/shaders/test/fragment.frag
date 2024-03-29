precision mediump float;

uniform vec3 uColor;

// varying float vRandom; // From vertex shader

void main()
{
    gl_FragColor = vec4(uColor, 1.0);
}
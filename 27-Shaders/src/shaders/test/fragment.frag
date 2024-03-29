uniform vec3 uColor;
uniform sampler2D uTexture; //* NOTE: The type for textures is 'sampler2D'

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv); // Pick colors from texture using UV coordinates from the geometry

    // Don't want to change the alpha, just the r, g, and b values
    textureColor.rgb *= vElevation * 2.0 + 0.5;

    gl_FragColor = textureColor; // Since texture2D returns a vec4 you can pass it directly to gl_FragColor
    // gl_FragColor = vec4(uColor, 1.0);
}
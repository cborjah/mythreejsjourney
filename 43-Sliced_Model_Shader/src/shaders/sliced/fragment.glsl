uniform float uSliceStart;
uniform float uSliceArc;

varying vec3 vPosition;

void main()
{
    // NOTE: The y coordinate must come before the x coordinate.
    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart;
    angle = mod(angle, PI2); // Updated the arc tangent angle to get a range from 0 to 2*PI (PI2). Only positive values for the angle.

    // NOTE: Using modulo on negative numbers can result in a different behavior based on the environment.
    // -0.25 % 1 in JS will output -0.25 and not 0.75 like in GLSL.

    if (angle > 0.0 && angle < uSliceArc) {
        discard;
    }

    // NOTE: Having csm_FragColor in the custom shader causes the gl_FragColor of the final shader
    // to be overriden by csm_FragColor, and the default csm_FragColor is the color that is
    // sent to the material in script.js.

    // csm_FragColor = vec4(0.75, 0.15, 0.3, 1.0);

    // NOTE: Besides a float, you can use vec2 or vec3, or whatever you want.
    float csm_Slice; // This is enough to activate the patch map.
}

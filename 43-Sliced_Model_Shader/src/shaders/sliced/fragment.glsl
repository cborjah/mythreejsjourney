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

    csm_FragColor = vec4(vec3(angle), 1.0);
}

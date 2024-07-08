#include ../includes/simplexNoise4d.glsl

void main()
{
    // Wobble
    float wobble = simplexNoise4d(vec4(
                csm_Position, // xyz
                0.0
            ));
    csm_Position += wobble * normal;
}

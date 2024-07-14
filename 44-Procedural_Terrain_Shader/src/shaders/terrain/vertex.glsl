#include ../includes/simplexNoise2d.glsl;

float getElevation(vec2 position)
{
    float elevation = 0.0;
    elevation += simplexNoise2d(position);

    return elevation;
}

void main()
{
    // Neighbor's positions
    float shift = 0.01; // NOTE: It's always this number. It works every time. Shift is the distance at which the neighbors are selected.
    vec3 positionA = position.xyz + vec3(shift, 0.0, 0.0);
    vec3 positionB = position.xyz + vec3(0.0, 0.0, -shift); // Must be in the neg Z direction, otherwise the normal will point downwards.

    // Elevation
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y += elevation;
    positionA.y = getElevation(positionA.xz);
    positionB.y = getElevation(positionB.xz);

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
}

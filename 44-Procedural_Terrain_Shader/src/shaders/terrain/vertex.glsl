uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

#include ../includes/simplexNoise2d.glsl;

float getElevation(vec2 position)
{
    vec2 warpedPosition = position;
    warpedPosition += uTime * 0.2;

    // NOTE: Multiply the warpedPosition by the uPositionFrequency so that it follows the position frequency.
    warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;

    // NOTE: The sign() function retuns -1.0 if x is less than 0.0,
    // 0.0 if x is equal to 0.0, and +1.0 if x is greater than 0.0.
    // Use this to preserve negative values when using pow().
    // Basically the sign() function preserves the sign of the value when used to multiply with.
    float elevationSign = sign(elevation);
    // NOTE: When a negative number is raised to an odd power and multiplied by its sign (-),
    // you get a positive number. Use the abs() function on the negative value first, then
    // apply the pow() function followed by the sign() function.
    // This allows you to use even and odd powers, while preserving the values sign.
    elevation = pow(abs(elevation), 2.0) * elevationSign; // Crush values using pow().
    elevation *= uStrength;

    // elevation = pow(elevation, 2.0); // Doesn't work for this case, negative elevation is lost.

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

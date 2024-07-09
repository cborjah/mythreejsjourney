uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

#include ../includes/simplexNoise4d.glsl

/*
 * To make the wobble more interesting you could combime multiple Simplex Noises
 * with various frequencies, but that would look more like waves...
 *
 * Instead, 'warp' the position that is sent to the Simple Noise function using
 * another Simplex Noise.
 */

float getWobble(vec3 position)
{
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
                position * uWarpPositionFrequency,
                uTime * uWarpTimeFrequency
            )) * uWarpStrength;

    return simplexNoise4d(vec4(
            warpedPosition * uPositionFrequency, // xyz
            uTime * uTimeFrequency
        )) * uStrength;
}

void main()
{
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbors positions
    float shift = 0.01; // Distance towards the neighbors
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    // csm_Position is the current vertex position
    // positionA and positionB are two neighbors (points)
    // The direction from the current vertex to the neighbors is needed

    // Wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
}

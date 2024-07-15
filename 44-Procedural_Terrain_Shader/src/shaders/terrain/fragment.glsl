uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl

// Add colors based on elevation
void main()
{
    // Color
    vec3 color = vec3(1.0);

    // Water
    float surfaceWaterMix = smoothstep(-1.0, -0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // Sand
    float sandMix = step(-0.1, vPosition.y);
    color = mix(color, uColorSand, sandMix);

    // Grass
    float grassMix = step(-0.06, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    // Rock
    // The rock color is place BEFORE the snow because you want the snow to cover rock.
    float rockMix = vUpDot;
    rockMix = 1.0 - step(0.8, rockMix);
    rockMix *= step(-0.06, vPosition.y); // Apply grassMix to rockMix to remove rocks from appearing below the grass theshold.
    color = mix(color, uColorRock, rockMix);

    // Snow
    float snowThreshold = 0.45;
    snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
    float snowMix = step(snowThreshold, vPosition.y);
    color = mix(color, uColorSnow, snowMix);

    // Final color
    // NOTE: Update the csm_DiffuseColor, NOT the csm_FragColor.
    // This way all the shading (shadows, relfections, etc.) will be applied.
    csm_DiffuseColor = vec4(color, 1.0);
}

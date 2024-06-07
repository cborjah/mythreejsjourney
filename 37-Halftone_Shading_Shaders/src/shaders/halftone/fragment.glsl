uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl

vec3 halftone(vec3 color, float repetitions, vec3 direction, float low, float high, vec3 pointColor, vec3 normal)
{
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    // NOTE: gl_FragCoord contains the window-relative coordinates of the current fragment.
    // When you divide a vec2 by ONE float, it will divide both the x and the y.
    // This is done to maintain the square shape of each grid.
    vec2 uv = gl_FragCoord.xy / uResolution.y; // Dividing by y will only allow resizing of the grid when the window height changes.
    uv *= repetitions; // Controls the amount of cells vertically.
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    return mix(color, pointColor, point); // Mix color with pointColor depending on the point value. If point is 0 you get color. If point is 1 you get pointColor.
}

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);

    light += ambientLight(
            vec3(1.0), // Light color
            1.0 // Light intensity
        );

    light += directionalLight(
            vec3(1.0, 1.0, 1.0),
            1.0,
            normal,
            vec3(1.0, 1.0, 0.0),
            viewDirection,
            1.0
        );

    color *= light;

    // Halftone
    color = halftone(color, uShadowRepetitions, vec3(0.0, -1.0, 0.0), -0.8, 1.5, uShadowColor, normal);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    // gl_FragColor = vec4(point, point, point, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

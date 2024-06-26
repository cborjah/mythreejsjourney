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

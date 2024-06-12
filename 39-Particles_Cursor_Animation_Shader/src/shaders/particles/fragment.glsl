varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    // float distanceToCenter = distance(uv, vec2(0.5));
    float distanceToCenter = length(uv - vec2(0.5)); // Same as above, but more widely used. Slight perfomance increase.

    // NOTE: The distance can be used to play with the alpha, but the alpha tends to create visual bugs.
    // "discard" can be used instead.
    // It prevents the fragment from being drawn (rendered) entirely without even relying on transparency.
    // discard can have a perfomance impact that is hard to predict, but it's usually negligible.

    if (distanceToCenter > 0.5)
        discard;

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

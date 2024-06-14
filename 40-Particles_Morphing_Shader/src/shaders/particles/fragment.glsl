void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 0.05 / distanceToCenter - 0.1; // Divide by small number technique.

    gl_FragColor = vec4(alpha, alpha, alpha, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}


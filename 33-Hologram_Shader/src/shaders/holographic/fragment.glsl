uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    // Normal
    // NOTE: Between vertices, varying are interpolated. If you interpolate two normalized
    // vectors, you don't necessarily end up with a vector length of 1. This causes a 'grid'
    // pattern to be visible.
    // Use the normalize function to fix this.
    vec3 normal = normalize(vNormal);

    // Invert normals on the backside of the object so that they are visible.
    if (!gl_FrontFacing) {
        normal *= -1.0;
    }

    // Stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    // Fresnel
    // NOTE: In this case the fresnel value should NOT change with the object rotation.
    // The viewDirection vector should be the same length as the normal vector, which is 1. Normalize value to accomplish this.
    vec3 viewDirection = normalize(vPosition - cameraPosition); // The cameraPosition variable is made available by Three.js
    float fresnel = dot(viewDirection, normal) + 1.0; // The dot product returns 1 if the two vectors are parallel to each other, 0 if they're perpendicular, and -1 if they are in opposite directions.
    fresnel = pow(fresnel, 2.0); // Apply a power to the fresnel to make it sharper.

    // Falloff
    // Smooth remapping means use the smoothstep fn.
    float falloff = smoothstep(0.8, 0.0, fresnel); // 0.8 and 0.0 are the limits because we've already applied a 'pow' on the fresnel value and also because the 'AdditiveBlending' is making the edges already quite bright since both sides are rendered.

    // Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25; // Add the fresnel value to the holographic value to make the fresnel effect brighter
    holographic *= falloff;

    // Final color
    gl_FragColor = vec4(1.0, 1.0, 1.0, holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

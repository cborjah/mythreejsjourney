uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;

    // Canvas bug fix
    // Remap displacementIntensity by ignoring anything below 0.1.
    // This will allow particles to return to their initial positions.
    // This bug is due to the trail not disappearing from the canvas completely.
    displacementIntensity = smoothstep(0.1, 1.0, displacementIntensity);

    // Displacement direction
    vec3 displacement = vec3(
            cos(aAngle) * 0.2, // Reduce intensity by 20%
            sin(aAngle) * 0.2, // Reduce intensity by 20%
            1.0
        );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;

    newPosition += displacement;

    // Use the texture() function to pick the color from the uPictureTexture at the uv coordinates
    // (whole geometry, not individual particles) and swizzle the r channel.

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;

    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);

    // Varyings
    vColor = vec3(pow(pictureIntensity, 2.0));
}

uniform vec2 uResolution;
uniform sampler2D uPictureTexture;

varying vec3 vColor;

void main()
{
    // Use the texture() function to pick the color from the uPictureTexture at the uv coordinates
    // (whole geometry, not individual particles) and swizzle the r channel.

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
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

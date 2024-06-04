uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

// value - The value you want to remap
// originMin/originMax - The start and end of the original range
// destinationMin/destinationMax - The start and end of the destination range
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
    vec3 newPosition = position;

    // Exploding
    float explodingProgress = remap(uProgress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    newPosition *= explodingProgress;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final size
    gl_PointSize = uSize * uResolution.y * aSize; // The y property is used because the resizing should only occur when changing window height. Field of view changes vertically, not horizontally in MOST cases.
    gl_PointSize *= 1.0 / -viewPosition.z; // Add perspective to particles. They get bigger the closer the camera gets and vice versa.
}

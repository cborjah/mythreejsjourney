uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;

void main()
{
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final size
    gl_PointSize = uSize * uResolution.y * aSize; // The y property is used because the resizing should only occur when changing window height. Field of view changes vertically, not horizontally in MOST cases.
    gl_PointSize *= 1.0 / -viewPosition.z; // Add perspective to particles. They get bigger the closer the camera gets and vice versa.
}

uniform vec2 uFrequency;
uniform float uTime;

// Sending attributes to fragment shader
// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
   // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

   // Shorthand way of defining gl_Position
   // Same results, but this allows you to play with the model position
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);   

   // Refactor the following values into the elevation variable in order to pass it on to the fragment shader
   // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
   // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

   float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
   elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
   modelPosition.z = elevation;

   vec4 viewPosition = viewMatrix * modelPosition;
   vec4 projectedPosition = projectionMatrix * viewPosition;

   gl_Position = projectedPosition;

   vUv = uv; // Pass uv value from geometry to the fragment shader
   vElevation = elevation; // Pass elevation value to the fragment shader
}
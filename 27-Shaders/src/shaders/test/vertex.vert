uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// Retrieves the value of each vertex
// Contains the x, y, and z coordinates from the attribute
attribute vec3 position;
attribute vec2 uv;
attribute float aRandom; // It is a float because there's only one value per vertex

// Sending attributes to fragment shader
// varying float vRandom;
varying vec2 vUv;

void main()
{
   // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

   // Shorthand way of defining gl_Position
   // Same results, but this allows you to play with the model position
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);   
   modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
   modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

   vec4 viewPosition = viewMatrix * modelPosition;
   vec4 projectedPosition = projectionMatrix * viewPosition;

   gl_Position = projectedPosition;

   // vRandom = aRandom;
   vUv = uv; // Pass uv value from geometry into the varying vUv variable
}
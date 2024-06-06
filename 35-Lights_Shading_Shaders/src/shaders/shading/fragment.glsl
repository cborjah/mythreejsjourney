uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    // NOTE: The interpolated normals will be a different length than the other normals. This will
    // cause unwanted visual artifacts (grid pattern in this case). Normalize the value to fix this issue.
    vec3 normal = normalize(vNormal);

    vec3 viewDirection = normalize(vPosition - cameraPosition); // Normalize the vector otherwise it may be large.
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);

    // NOTE: You can add lights together to add them to the scene.

    light += ambientLight(
            vec3(1.0), // Light color
            0.03 // Light intensity
        );

    light += directionalLight(
            vec3(0.1, 0.1, 1.0), // Light color
            1.0, // Light intensity
            normal, // Normal
            vec3(0.0, 0.0, 3.0), // Light position
            viewDirection,
            20.0 // Specular power
        );

    light += pointLight(
            vec3(1.0, 0.1, 0.1), // Light color
            1.0, // Light intensity
            normal, // Normal
            vec3(0.0, 2.5, 0.0), // Light position
            viewDirection,
            20.0, // Specular power
            vPosition, // Position
            0.25 // Decay
        );

    // NOTE: A common mistake is to add the light to the color.
    // Instead the object's color needs to be multiplied by the light.
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

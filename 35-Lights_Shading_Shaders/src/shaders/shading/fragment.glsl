uniform vec3 uColor;

varying vec3 vNormal;

#include ../includes/ambientLight.glsl

vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition)
{
    // NOTE: The difference between the light direction and light position is that the direction is
    // normalized (with a length of 1).
    vec3 lightDirection = normalize(lightPosition);

    // Shading
    float shading = dot(normal, lightDirection);

    // return lightColor * lightIntensity;
    return vec3(shading);
}

void main()
{
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);

    // NOTE: You can add lights together to add them to the scene.

    /* light += ambientLight(
        vec3(1.0), // Light color
        0.03 // Light intensity
    ); */

    light += directionalLight(
            vec3(0.1, 0.1, 1.0), // Light color
            1.0, // Light intensity
            vNormal, // Normal
            vec3(0.0, 0.0, 3.0) // Light position
        );

    // NOTE: A common mistake is to add the light to the color.
    // Instead the object's color needs to be multiplied by the light.
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}


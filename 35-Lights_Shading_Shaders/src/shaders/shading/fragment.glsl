uniform vec3 uColor;

#include ../includes/ambientLight.glsl

void main()
{
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);

    // NOTE: You can add lights together to add them to the scene.
    light += ambientLight(
            vec3(1.0), // Light color
            0.03 // Light intensity
        );

    // NOTE: A common mistake is to add the light to the color.
    // Instead the object's color needs to be multiplied by the light.
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}


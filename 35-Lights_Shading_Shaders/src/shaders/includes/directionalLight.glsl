vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)
{
    // NOTE: The difference between the light direction and light position is that the direction is
    // normalized (with a length of 1).
    vec3 lightDirection = normalize(lightPosition);

    // NOTE: You want the reflection of the light coming toward the surface, but the
    // direction of the light is currently the exact opposite and corresponds to a vector going
    // toward the light. Invert the direction of the light to fix this.
    vec3 lightReflection = reflect(-lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading); // Use max function as a way of 'clamping' the value so it can't be negative (which negates the ambient light).

    // Specular
    // NOTE: With the dot product, if the vectors are going in the same direction, you get 1 which
    // is the opposite of what you want in this case. Invert the value.
    float specular = -dot(lightReflection, viewDirection);

    // NOTE: If you use an odd value, there will be a 'dark spot' effect on the back of objects.
    // This is a result of the dot product which is negative in the back. When raising a number to
    // an even power you get the follow situation, -1 * -1 = 1 and -1 * 1 = -1 when the power is odd.

    // NOTE: Make sure you don't get a value below 0. Clamp the value! This also prevents the 'dark spot'
    // issue with odd powers.
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    // NOTE: Adding the specular value by itself, the specular light won't have the correct color
    // and will be too bright. Multiply it with the base light color.

    // NOTE: The specular also depends on the light intensity. If the light is brighter you should see
    // the reflection more clearly. If you don't include light intensity, the specular can be overpowered
    // and 'hidden' by the light. Multiply the specular value by the light intensity!
    return lightColor * lightIntensity * (shading + specular);
}

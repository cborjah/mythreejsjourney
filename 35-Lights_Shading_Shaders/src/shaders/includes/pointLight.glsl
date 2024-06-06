// Point Light
// Similar to directional light, but with two differences.
// - The light is considered to come from a point (not a general direction)
// - You want the light to decay
vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)
{
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);

    // NOTE: The vector difference between the light position and the object position should equal 1.
    vec3 lightDirection = normalize(lightDelta);

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

    // Decay
    // NOTE: The value should start at 1 when the distance is 0 and to reduce progressively.
    // In this case the light decays to quickly. The point light is currently 2.5 units above
    // Suzanne and after 1 unit, the decay will be 0.0. Reduce the decay by decreasing the
    // light distance. It is multiplied by the lightDecay parameter in this case.
    float decay = 1.0 - lightDistance * lightDecay;
    decay = max(0.0, decay); // Clamp value to ensure the decay effect doesn't affect other light effects.

    // NOTE: Adding the specular value by itself, the specular light won't have the correct color
    // and will be too bright. Multiply it with the base light color.

    // NOTE: The specular also depends on the light intensity. If the light is brighter you should see
    // the reflection more clearly. If you don't include light intensity, the specular can be overpowered
    // and 'hidden' by the light. Multiply the specular value by the light intensity!
    return lightColor * lightIntensity * decay * (shading + specular);
}

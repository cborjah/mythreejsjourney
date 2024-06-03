float random2D(vec2 value) // Returns a 'random' float from 0.0 to 1.0
{
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

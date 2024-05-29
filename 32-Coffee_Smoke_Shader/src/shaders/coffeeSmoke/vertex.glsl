void main()
{
    // NOTE: The order of matrices is important! Matrices go first, then the variable you want to transform using the matrices.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

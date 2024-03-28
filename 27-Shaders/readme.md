# Three.js Journey

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Shaders

**What are they?**

-   One of the main components of WebGL
-   Must learn at first if doing native WebGL
-   A program written in GLSL, sent to the GPU
-   Position each vertex of a geometry
-   Colorize each visible pixel of that geometry
-   There are two types of shaders
    -   Vertex shader
        -   Position each vertex of the geometry
    -   Fragment shader
        -   Color each visible fragment (or pixel) of the geometry
        -   Is executed after the vertex shader
-   Both can receive 'Uniform' data, but only vertex shaders can take 'Attributes'
    -   Attributes are information that changes between each vertices (like their positions)
    -   Uniforms are information that doesn't change between vertices (or fragments)
-   The vertex shader can send data to the fragment shader using 'varying'
    -   The 'Varyings' value gets interpolated between the vertices

**Why should we write our own shaders?**

-   Three.js materials are limited
-   Our shaders can be very simple, limited, and optimized
-   We can add custom post-processing

**Creating your first shaders with `RawShaderMaterial`**

-   You can use a `ShaderMaterial` or a `RawShaderMaterial`
    -   `ShaderMaterial` will have some code automaticaly added to the shader code
    -   `RawShaderMaterial` will have nothing

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

### .glsl / .vert / .frag file types

**Cannot use `console.log` in these file types**<br>
**Semicolon is REQUIRED to end any instruction**<br>
Indentation is not essential

#### Importing

-   `vite-plugin-glsl`: easier to use and well maintained
-   `vite-plugin-glslify`: the standard

`vite-plugin-glsl` is used in this project
**Note: Can be installed under dev deps**

### Variables

GLSL is a typed language

**You MUST specify a variable's type**

You can convert types on the fly, but you cannot combine values with different types.

```c#
float a = 1.0;
int b = 2;
float c = a * float(b);
```

### Vectors

**Vector 2 (`vec2`)**: used to store 2 coordinates (`x` and `y`). Slightly similiar to Three.js' `Vector2`

```c#
vec2 foo = vec2(-1.0, 2.0);

// Values can be reassigned
foo.x = 1.0;
foo.y = 2.0;

// Doing operations on a vec2 will multiply both the x and y
foo *= 2.0;
```

**Vector 3 (`vec3`)**: similar to `vec2` but with a `z`. Convenient for 3D coordinates.

```c#
// Can use r, g, and b (aliases)
vec3 purpleColor = vec3(0.0);
purpleColor.r = 0.5;
purpleColor.b = 1.0;

// Can be partially created from a vec2
vec2 foo = vec2(1.0, 2.0);
vec3 bar = vec3(foo, 3.0);

// Can be used to partially create a vec2
// This is called a swizzle
vec3 foo = vec3(1.0, 2.0, 3.0);
vec2 bar = foo.xy; // swizzle. The order can be different '.yx'
```

**Vector 4 (`vec4`)**: similar to `vec3` but with a `w`. Slightly similar to Three.js' `Vector4`.

`a` is an alias of `w`.<br>
`a` is for alpha.

```c#
vec4 foo = vec4(1.0, 2.0, 3.0, 4.0);
vec4 bar = vec4(foo.zw, vec2(5.0, 6.0));
```

### Functions

A function must start with the type of the value that will be returned.

```c
float loremIpsum(float a, float b) { return a + b; }
float result = loremIpsum(1.0, 2.0);
```

## RawShaderMaterial

Properties likes `map`, `alphaMap`, `opacity`, `color`, etc. won't work and you need to write these features manually.

## Documentation

[Shaderific documentation](https://shaderific.com/glsl.html) - documentation of an iOS application to do shaders

Shaderific is an iOS application that lets you play with GLSL. The application is not something to care about, but the documentation isn't too bad.

[Kronos Group OpenGL reference pages](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php) - OpenGL documentation, but very close to WebGL.

This documentation deals with OpenGL, but most of the standard functions you'll see will be compatible with WebGL. Let's not forget that WebGL is just a JavaScript API to access OpenGL.

[Book of shaders documentation](https://thebookofshaders.com/) - A great course about fragment shaders!

The book of shaders mainly focus on fragment shaders and has nothing to do with Three.js but it is a great resource to learn and it has its own glossary.

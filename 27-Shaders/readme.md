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

#### The main Function

The `main` function is required for `.glsl`, `.vert`, and `.frag` files. It is called automatically an doesn't return anything (returns `void`).

**gl_Position**

-   Already exists, just needs to be assigned.
-   Contains the position of the vertex on the screen.
-   MUST be a `vec4`.
    -   Has 4 values, because coordinates provided are in `clip space`.
    -   `clip space` is not 2D, it looks more like a 3D box.
    -   x, y, z axis
    -   The fourth value is about perspective (homogeneous coordinates)

**Matrices Uniforms**

#### Vertex shader:

Each matrix will transform the `position` until we get the final clip space coordinates.

-   There are currently 3 matrices
-   `uniforms` because they are all the same for all the vertices
-   Each matrix will do a part of the transformation
-   To apply a matrix, you multiply it
-   The matrix must have the same size as the coordinate (`mat4` for `vec4`)

`modelMatrix` applies transformations relative to the `Mesh` (position, rotation, and scale)<br>
`viewMatrix` applies transformations relative to the camera (position, roations, FOV, near, far)<br>
`projectionMatrix` transforms the coordinates into the clip space coordinates

There is a shorter version where the `viewMatrix` and the `modelMatrix` are combined into a `modelViewMatrix`.

#### Fragment shader:

**Precision**

-   Mandatory
-   Lets you decide how precise a `float` can be.
    -   highp
        -   Can have a performance hit and might not work on some devices.
    -   mediump
        -   Most commonly used.
    -   lowp
        -   Can create bugs by the lack of precision.

**gl_FragColor**

-   Already exists, just needs to be assigned.
-   Contains the color of the fragment.
-   `vec4` (r, g, b, and a)
-   a is for alpha.

    -   Need `transparent` property set to `true` if alpha is below 1.0.

**Attributes**

`position` is already sent and you can add your own attributes to the `BufferGeometry`.

[OpenGL Coordinate Systems](https://learnopengl.com/Getting-started/Coordinate-Systems.)

#### Uniforms

Useful for:

-   Having the same shader but with different results.
-   Being able to tweak values.
-   Animating the value.
-   Can be used in both vertex and fragment shaders.

`type` is no longer required to be defined, just the value of the uniform.

## RawShaderMaterial

Properties likes `map`, `alphaMap`, `opacity`, `color`, etc. won't work and you need to write these features manually.

## Debugging

Since you cannot use `console.log` in .glsl, .vert, and .frag files, you can use the `gl_FragColor` to test values on the screen. If the values you want to test are in the vertex shader, pass them to the fragment shader using varyings and assign `gl_FragColor` to the values.

## Resources

[Shaderific documentation](https://shaderific.com/glsl.html) - documentation of an iOS application to do shaders

Shaderific is an iOS application that lets you play with GLSL. The application is not something to care about, but the documentation isn't too bad.

[Kronos Group OpenGL reference pages](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php) - OpenGL documentation, but very close to WebGL.

This documentation deals with OpenGL, but most of the standard functions you'll see will be compatible with WebGL. Let's not forget that WebGL is just a JavaScript API to access OpenGL.

[Book of shaders documentation](https://thebookofshaders.com/) - A great course about fragment shaders!

The book of shaders mainly focus on fragment shaders and has nothing to do with Three.js but it is a great resource to learn and it has its own glossary.

[ShaderToy](https://www.shadertoy.com/)

[The Art of Code Youtube Channel](https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg)

[Lewis Lepton Youtube Channel](https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ)

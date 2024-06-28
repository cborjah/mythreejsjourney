import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import GUI from "lil-gui";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import gpgpuParticlesShader from "./gpgpu/particles.glsl";

/**
 * NOTE: GPGPU
 *
 * General-Purpose computing on Graphics Processing
 *
 * A way of using the GPU to process data rather than rendering pixels for the end-user.
 * Great for when you need to do the same complex calculation thousands of times.
 *
 * GPGPU uses textures. It utilizes FBO (Frame Buffer Object).
 * FBOs are textures in which the computed data is saved instead of doing it on the <canvas>.
 * They can be created in Three.js using WebGLRenderTarget.
 *
 * Data textures cannot be seen.
 * These textures will contain the position of the vertices in this example.
 * This is how to persist data.
 * This texture is going to be a huge texture with thousands of pixels, and each particle
 * will contain the position of the particle.
 * Each pixel of the texture is used for one particle where the RGB channels correspond to the XYZ coordinates.
 */

/**
 * NOTE: Flow field
 *
 * Corresponds to spatialized streams.
 * For any point in space, you calculate a direction.
 *
 * Takes up a considerable amount of computing power.
 * Doing the calculation for each frame for thousands of particles using just the
 * CPU is not possible.
 *
 * This is a job for GPGPU.
 */

/**
 * Using pixels as data is difficult because of the various formats and types
 * a pixel can have.
 */

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Materials
    particles.material.uniforms.uResolution.value.set(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
    );

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(4.5, 4, 11);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

debugObject.clearColor = "#29191f";
renderer.setClearColor(debugObject.clearColor);

/**
 * Base Geometry
 */
const baseGeometry = {};
baseGeometry.instance = new THREE.SphereGeometry(3); // Create an instance of the sphere geometry
baseGeometry.count = baseGeometry.instance.attributes.position.count; // Number of vertices

/**
 * GPU Compute
 */

// Setup
const gpgpu = {};

// Each pixel of the FBOs will correspond to one particle.
// Using the square root, you can calulate its dimensions in order to form a square.
// Round up to ensure there are always enough pixels to account for each particle while maintaining a square.
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));

// Instantiate the GPUComputationRenderer
gpgpu.computation = new GPUComputationRenderer(
    gpgpu.size,
    gpgpu.size,
    renderer
);

/**
 * Base Particles
 */
const baseParticlesTexture = gpgpu.computation.createTexture();

/**
 * Configure each particle's (of the sphere) coordinates (x, y, z) as the (r, g, b) channels and ignore
 * the a channel for now.
 */
for (let i = 0; i < baseGeometry.count; i++) {
    // Strides
    const i3 = i * 3;
    const i4 = i * 4;

    // Position based on geometry
    baseParticlesTexture.image.data[i4 + 0] =
        baseGeometry.instance.attributes.position.array[i3 + 0];
    baseParticlesTexture.image.data[i4 + 1] =
        baseGeometry.instance.attributes.position.array[i3 + 1];
    baseParticlesTexture.image.data[i4 + 2] =
        baseGeometry.instance.attributes.position.array[i3 + 2];
    baseParticlesTexture.image.data[i4 + 3] = 0;
}

// Particles Variable
gpgpu.particlesVariable = gpgpu.computation.addVariable(
    "uParticles",
    gpgpuParticlesShader,
    baseParticlesTexture // This texture will be injected into the gpgpuParticlesShader param above this param
);

// Re-inject the "variable" into itself
// The first parameter is the variable, and the second is an array containing the dependencies
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
    gpgpu.particlesVariable //
]);

// Init
gpgpu.computation.init(); // Initialize the GPUComputationRenderer

// Debug
gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
        map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable)
            .texture
    })
);
gpgpu.debug.position.x = 3;
scene.add(gpgpu.debug);

/* console.log(
    gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
); */

/**
 * Particles
 */
const particles = {};

// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(
            new THREE.Vector2(
                sizes.width * sizes.pixelRatio,
                sizes.height * sizes.pixelRatio
            )
        )
    }
});

// Points
particles.points = new THREE.Points(baseGeometry.instance, particles.material);
scene.add(particles.points);

/**
 * Tweaks
 */
gui.addColor(debugObject, "clearColor").onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
});
gui.add(particles.material.uniforms.uSize, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uSize");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update controls
    controls.update();

    // GPGPU Update
    gpgpu.computation.compute();

    // Render normal scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

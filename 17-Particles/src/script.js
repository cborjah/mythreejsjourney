import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10; // -5 - 5
    colors[i] = Math.random(); // 0 - 1
}

particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true; // If particle is far from the camera, it will be small, and vice versa.
// particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.vertexColors = true;

// The alphaTest is a value between 0 and 1 that enables the WebGL to know when not to render the
// pixel according to that pixel's transparency.
// By default, the value is 0 meaning that the pixel will be rendered anyways.
// Use 0.001
// Without this, you will still be able to see the edges of the particles.
// This is because the particles are drawn in the same order as they are created,
// and WebGL doesn't know which one is in front of the other.
// particlesMaterial.alphaTest = 0.001;

/**
 * Depth Testing
 *
 * When drawing, WebGL tests if what's being drawn is closer than what's already drawn.
 * This can be deactivated with alphaTest.
 * Deactivating this will allow WebGL to draw everything, regardless whether it's in front or not.
 *
 * ! Deactivating the depth testing might create bugs if you have other objects in your scene or
 * ! particles with different colors.
 */
// particlesMaterial.depthTest = false;

/**
 * Depth Buffer
 *
 * This is where the depth of what's being drawn is stored.
 *
 * Instead of not testing if the particle is closer than what's in this depth buffer,
 * you can tell WebGL not to write particles in that depth buffer.
 *
 ** Uncomment cube to see effect.
 */
particlesMaterial.depthWrite = false;

/**
 * The three technics can be used in conjunction as well, as there is no perfect solution.
 * You must adapt and find the best combination according to the project.
 */

/**
 * Blending
 *
 * WebGL currently draws pixels one on top of the other.
 * With the blending property, you can tell WebGL to ADD the color of the pixel to the
 * color of the pixel already drawn.
 *
 ** This can impact performance.
 */
particlesMaterial.blending = THREE.AdditiveBlending;

// Cube
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update particles
    // particles.rotation.y = elapsedTime * 0.05;

    for (let i = 0; i < count; i++) {
        // The following allows access to items in increments of 3.
        // [x,y,z] --> i + 0 = x; i + 1 = y; i + 2 = z
        const i3 = i * 3;

        const x = particlesGeometry.attributes.position.array[i3];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
            elapsedTime + x // Adding x to elapsedTime introduces an offset.
        );
    }

    //! Three.js needs to be notified when a geometry attribute changes.
    particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

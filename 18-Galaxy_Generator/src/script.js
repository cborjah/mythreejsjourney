import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 500 // Width of control panel
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    /**
     * Destroy old galaxy to free memory
     */
    if (points !== null) {
        console.log("CLEANIN UP");
        geometry.dispose();
        material.dispose();

        // You can't dispose of points as they are a combination of geometry and material.
        // Remove them from the scene.
        scene.remove(points);
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3); // [x,y,z,x,y,z,...]

    for (let i = 0; i < parameters.count; i++) {
        // Access in increments of 3
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle =
            ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        // Subtract 0.5 to change range from 0 - 1 to -0.5 to 0.5.
        // This allows randomness in both negative and positive directions.
        const randomX = (Math.random() - 0.5) * parameters.randomness;
        const randomY = (Math.random() - 0.5) * parameters.randomness;
        const randomZ = (Math.random() - 0.5) * parameters.randomness;

        // Subtract 0.5 to center
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }

    // Use setAttribute for BufferGeometries
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3) // Need to specify how many values per vertex (3 in this case)
    );

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    /**
     * Points
     */
    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

gui.add(parameters, "count")
    .min(100)
    .max(1000000)
    .step(100)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "radius")
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

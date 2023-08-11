import * as THREE from "three";

/**
 * requestAnimationFrame is to call the function provided on the next frame.
 * This will be called on each frame.
 *
 * * Need to adapt to the framerate or else the speed of the animations will
 * * differ based on the refresh rate of the device.
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Time
let time = Date.now();

// Animations
const tick = () => {
    /**
     * Time
     *
     * By multiplying the animation speed by deltaTime,
     * you ensure that the speed is the same regardless
     * of the framerate.
     */
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;

    // Update Objects
    // mesh.position.x += 0.01;
    mesh.rotation.y += 0.001 * deltaTime;

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

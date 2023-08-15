import * as THREE from "three";

/**
 * Cursor
 *
 * To get the cursor values to start from 1 and increase, divide by the canvas/viewport
 * height and width.
 */
const cursor = {
    x: 0,
    y: 0
};

window.addEventListener("mousemove", event => {
    // To have the values start at 0, divide the value by window height or width.
    // cursor.x = event.clientX / sizes.width;
    // cursor.y = event.clientY / sizes.height;

    // Subtract 0.5 from in addition to have negative and positive values.
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;

    // console.log("x", cursor.x);
    // console.log("y", cursor.y);
});

/**
 * Camera
 *
 * Camera is an abstract class. You're not supposed to use it directly.
 *
 * * ArrayCamera renders the scene from mulitple cameras on specific areas of the render.
 *
 * * StereoCamera renders the scene through two cameras that mimic the eyes to create a parallax
 * * effect. Use with devices like a VR headset, red & blue glasses, or VR cardboard.
 *
 * * CubeCamera does 6 renders, each one facing a different direction.
 * * This can render the surrounding for things like environment map, reflections,
 * * or shadow map.
 *
 * * OrthographicCamera renders the scene without perspective. (ex: AoE2)
 *
 * * PerspectiveCamera
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
    width: 800,
    height: 600
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

/**
 * Camera
 *
 * PerspectiveCamera(FOV, Aspect Ratio, Near, Far)
 *
 * FOV refers to the vertical vision angle (degrees), 40 - 75 is recommended.
 * Aspect ratio is the width of the render divided by the height of the render.
 * Any objects nearer than Near, or furthe than Far, will not show up. 1 and 1000 by default.
 *
 * OrthographicCamera(Left, Right, Top, Bottom, Near, Far)
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     1,
//     -1,
//     0.1,
//     100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Update Camera
    // camera.position.x = cursor.x * 10; // x values increase when mouse moves RIGHT
    // camera.position.y = cursor.y * -10; // y values increase when mouse moves DOWN
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;

    // camera.lookAt(new THREE.Vector3()); // Vector3 is a point in 3D space in this case.
    // camera.lookAt(mesh.position); // Instead of creating a new Vector3 every tick, use the cube which is also at the center.

    /**
     * Built-in Controls
     * https://threejs.org/docs/index.html?q=controls#examples/en/controls/
     *
     * Instead of manually setting the camera position using the cursor, utilize the controls
     * provided by Three.js.
     *
     * * TransformControls works differently than the other cameras. It can be used to make
     * * an editor for example.
     * * DragControls is the same. It is used to move objects.
     */

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

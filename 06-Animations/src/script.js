import * as THREE from "three";
import gsap from "gsap";

/**
 * requestAnimationFrame is to call the function provided on the next frame.
 * This will be called on each frame.
 *
 * ! Do NOT use the getDelta method (might need fixing).
 *
 * * Need to adapt to the framerate or else the speed of the animations will
 * * differ based on the refresh rate of the device.
 *
 * If you want to have more control, create tweens, create timelines, etc., you can use a library like GSAP.
 *
 * * GreenSock Animation Platform
 * ? https://github.com/greensock/GSAP
 *
 * GSAP is a robust JavaScript toolset that turns developers into
 * animation superheroes. Build high-performance animations that work in every major browser.
 * Animate CSS, SVG, canvas, React, Vue, WebGL, colors, strings, motion paths, generic objects...
 * anything JavaScript can touch!
 *
 * GSAP figures out the current values automatically (you don't need to define starting values,
 * though you can in a fromTo() tween). Since GSAP can animate any property of any object, you are
 * NOT limited to CSS properties or DOM objects. Go crazy. You may be surprised by how many things
 * can be animated with GSAP and it "just works".
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
// let time = Date.now();

// Clock
// const clock = new THREE.Clock();

/**
 * Tweens
 *
 * To simply fire off animations and let them run, there's no need to use variables. Tweens play
 * immediately by default and when the finish, they automatically dispose of themselves.
 */
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

// Animations
const tick = () => {
    /**
     * Time
     *
     * By multiplying the animation speed by deltaTime,
     * you ensure that the speed is the same regardless
     * of the framerate.
     */
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;

    // Clock
    // const elapsedTime = clock.getElapsedTime();

    // Update Objects
    // mesh.position.x += 0.01;
    // mesh.rotation.y += 0.001 * deltaTime;
    // Unlike with using time, the translation is set to the elapsed time.
    // mesh.rotation.x = elapsedTime;
    // The following gives you 1 full rotation per second. Try using other Math methods! Math.sin()
    // mesh.rotation.y = elapsedTime * Math.PI() * 2;
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

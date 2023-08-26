import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

THREE.ColorManagement.enabled = false;

/**
 * Notes
 *
 * * Typeface Converter
 * https://gero3.github.io/facetype.js/
 *
 * * Matcaps resource
 * https://github.com/nidorx/matcaps
 * ! Make sure to check licenses !
 * A high-resolution texture is not necessary, 256x256 should be more than enough.
 *
 * Bounding is used to help calculate if an object is on screen (frustum culling).
 *
 * * Continuous Integration
 * A modern hosting solution that employs automatisation of testing, deployment, etc.
 *
 * Vercel
 * Netlify
 * GitHub Pages
 */

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");

/**
 * Fonts
 *
 * Make sure to optimize performance since 3D text can require a lot of processing power.
 * Start with the curveSegments and bevelSegments.
 * Get these as low as possible while still maintaining a level of detail you are happy with.
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", font => {
    const textGeometry = new TextGeometry("Hello Three.js!", {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 3
    });

    // textGeometry.computeBoundingBox(); // Get Bounding Box
    // textGeometry.translate(
    //     // * Make sure to substract the bevelSize and bevelThickness
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // );

    textGeometry.center();

    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
    });
    // textMaterial.wireframe = true;
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    // const donutMaterial = new THREE.MeshMatcapMaterial({
    //     matcap: matcapTexture
    // });

    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material);

        // Subtracting 0.5 sets the range to -0.5 to 0.5
        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        // donut.scale.x = scale;
        // donut.scale.y = scale;
        // donut.scale.z = scale;
        donut.scale.set(scale, scale, scale); // Shorthand

        scene.add(donut);
    }
});

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
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

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Tone Mapping
 *
 * Intends to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values.
 * Three.js actually fakes the process of converting LDR to HDR even if the colors aren't
 * HDR resulting in a very realistic render.
 */

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse(child => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = global.envMapIntensity;
        }
    });
};

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1;
gui.add(global, "envMapIntensity")
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials);

// HDR (RGBE) equirectangular
rgbeLoader.load("/environmentMaps/0/2k.hdr", environmentMap => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
});

/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 6);
directionalLight.position.set(3, 7, 6);
scene.add(directionalLight);

gui.add(directionalLight, "intensity")
    .min(0)
    .max(10)
    .step(0.001)
    .name("lightIntensity");
gui.add(directionalLight.position, "x")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("lightX");
gui.add(directionalLight.position, "y")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("lightY");
gui.add(directionalLight.position, "z")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("lightZ");

/**
 * Models
 */
// Helmet
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", gltf => {
    gltf.scene.scale.set(10, 10, 10);
    scene.add(gltf.scene);

    updateAllMaterials();
});

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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Antialiasing
 *
 * This solution is called super sampling (SSAA) or fullscreen sampling (FSAA), and it's the easiest
 * and more efficient one. Unfortunately, that means 4 times more pixels to render, which can result
 * in performance issues.
 *
 * The other solution is called multi sampling (MSAA). Again, the idea is to render multiple values
 * per pixel (usually 4) like for the super sampling but only on the geometries' edges. The values
 * of the pixel are then averaged to get the final pixel value.
 *
 * Recent GPUs can perform this multi sampling anti-aliasing, and Three.js handles the setup
 * automatically. We just need to change the antialias property to true during the
 * instantiating — and not after.
 *
 * Screens with a pixel ratio above 1, AA is not really needed.
 */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 3;

gui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
});
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
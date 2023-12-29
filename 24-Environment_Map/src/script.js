import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
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
// Call this function when a model is loaded and added to the scene
const updateAllMaterials = () => {
    // console.log("Traverse the scene and update all materials.");

    scene.traverse(child => {
        // You only want to apply the environment map to the Meshes that have a MeshStandardMaterial
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            // console.log(child);
            child.material.envMapIntensity = global.envMapIntensity;
        }
    });
};

/**
 * Environment Map
 */
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);

// Global intensity
global.envMapIntensity = 1;
gui.add(global, "envMapIntensity")
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials);

// Low Dynamic Range (LDR) cube texture
// const environmentMap = cubeTextureLoader.load([
//     "/environmentMaps/0/px.png",
//     "/environmentMaps/0/nx.png",
//     "/environmentMaps/0/py.png",
//     "/environmentMaps/0/ny.png",
//     "/environmentMaps/0/pz.png",
//     "/environmentMaps/0/nz.png"
// ]);

// scene.background = environmentMap;

//* It's recommended to only use HDR environment mapping for lighting since they are usually
//* heavier to lead and render. This can be mitigated with a lower resolution and blurred background.
// HDR (RGBE) equirectangular
rgbeLoader.load("/environmentMaps/0/2k.hdr", environmentMap => {
    // console.log(environmentMap);
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
});

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 1,
        color: 0xaaaaaa
    })
);

torusKnot.position.y = 4;
torusKnot.position.x = -4;

//* Instead of setting the envMap manually on every mesh, set the environment property of the scene to the environment map.
// torusKnot.material.envMap = environmentMap;
// scene.environment = environmentMap;

scene.add(torusKnot);

/**
 * Models
 */
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
    // Time
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

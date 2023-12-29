import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GroundProjectedSkybox } from "three/addons/objects/GroundProjectedSkybox.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

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
// rgbeLoader.load("/environmentMaps/blender-2k.hdr", environmentMap => {
//     // console.log(environmentMap);
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     // scene.background = environmentMap;
//     scene.environment = environmentMap;
// });

// Ground projected skybox
// rgbeLoader.load("/environmentMaps/2/2k.hdr", environmentMap => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = environmentMap;

//     // Skybox
//     const skybox = new GroundProjectedSkybox(environmentMap);
//     skybox.radius = 120;
//     skybox.height = 11;
//     skybox.scale.setScalar(50);
//     scene.add(skybox);

//     gui.add(skybox, "radius", 1, 200, 0.1).name("skyboxRadius");
//     gui.add(skybox, "height", 1, 200, 0.1).name("skyboxHeight");
// });

/**
 * Real time environment map
 */
// LDR equirectanglar
const environmentMap = textureLoader.load(
    "environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg"
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;

// Holy donut
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: "white" })
);
holyDonut.position.y = 3.5;
scene.add(holyDonut);

// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    // Set type to match same behaviour as an HDR with a high range of data
    type: THREE.HalfFloatType
});

// For lighting, we add our custom generated environment map to scene
scene.environment = cubeRenderTarget.texture;

/**
 * Cube Camera
 *
 * Since we need to render one texture for each face of a cube, we need to render 6 square textures.
 * We could use a PerspectiveCamera, do some maths, make sure the field of view fills one side
 * perfectly, do the 6 renders, and combine them. Or we can use the CubeCamera which will do that
 * for us.
 *
 * The first parameter is the near, the second parameter is the far, and the third parameter is the
 * WebGLCubeRenderTarget in which to save the renders:
 */
// Render the scene in the cubeCamera by using its update method and sending it the renderer and the scene inside the tick function
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

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

    // Real-time environment map
    if (holyDonut) {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

        cubeCamera.update(renderer, scene);
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

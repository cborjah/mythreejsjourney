import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Path starts from within the static folder
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.png");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshBasicMaterial({ color: "red" });
// ! material.color = "red"; // You CAN'T do this since it's expecting a Color instance
// * You need to reinstantiate a new Color OR use the set method
// material.color = new THREE.Color("pink");
// material.color.set("yellow");
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.FrontSide; // side lets you decide which side of a face is visible
// material.side = THREE.DoubleSide; // ! Try to avoid using DoubleSide due to decreased performance
// material.side = THREE.BackSide;

// * Another way to apply materials
// const material = new THREE.MeshBasicMaterial();
// * You can combine colors and textures (tinted textures)!
// material.map = doorColorTexture;

/**
 * Normals
 *
 * Normals can be used for lighting, reflection, refraction, etc.
 * * MeshNormalMaterial is usually used to debug normals.
 */
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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

    // Update objects
    sphere.rotation.y = 0.5 * elapsedTime;
    plane.rotation.y = 0.2 * elapsedTime;
    torus.rotation.y = 0.3 * elapsedTime;

    sphere.rotation.x = 0.2 * elapsedTime;
    plane.rotation.x = 0.2 * elapsedTime;
    torus.rotation.x = 0.2 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

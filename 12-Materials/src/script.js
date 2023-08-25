import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

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
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
// Set the min/mag filters to NearestFilter, otherwise the mipmapping will cause loss of detail.
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

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

/**
 * Matcap
 *
 * Can find more matcaps online:
 * https://github.com/nidorx/matcaps
 *
 * Or create some using 3D software, or 2D (Photoshop).
 *
 * Can give the illusion that objects are being illuminated.
 *
 * * MeshMatcapMaterial will display a color by using the normals as a reference to pick the right
 * * color on a texture that looks like a sphere.
 */
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

/**
 * MeshDepthMaterial
 *
 * This will simply color the geometry in white if it's close to the near, and in black if it's
 * close to the far value of the camera.
 *
 * * Good for creating fog, pre-processing, etc.
 */
// const material = new THREE.MeshDepthMaterial();

/**
 * MeshLambertMaterial
 *
 * Reacts to light.
 */
// const material = new THREE.MeshLambertMaterial(); // Strange artifacts (lines) may show on the objects.
// const material = new THREE.MeshPhongMaterial(); // This does not have those artifacts. Has light that bounces back to the camera. Less performant than MeshLambertMaterial.
// material.shininess = 100;
// material.specular = new THREE.Color(0xff0000);

// const material = new THREE.MeshToonMaterial(); // Adds cell shaded look.
// material.gradientMap = gradientTexture;

/**
 * * MeshStandardMaterial (the standard)
 *
 * Uses physically based rendering principles (PBR).
 *
 * Like MeshLambertMaterial and MeshPhoneMaterial, it supports lights but with a more realistic
 * algorithm and better parameters like roughness and metalness.
 */
const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
material.map = doorColorTexture;

/**
 * AmbientOcclusion
 *
 * Adds shadows where the texture is dark.
 */
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;

/**
 * DisplacementMap
 *
 * Moves the vertices to create relief.
 *
 * * Add more vertices to objects to show more detail.
 *
 * It looks terrible in this case because it lacks vertices and the displacement is way too strong.
 */
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05;

// If you set the following, make sure not to set the same values elsewhere.
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;

/**
 * NormalMap
 *
 * Will fake the normals orientation and add details on the surface regardless of the subdivision.
 *
 * * Try to use when possible.
 */
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);

// * When setting the alpha map, make sure to set the material to transparent!
material.transparent = true;
material.alphaMap = doorAlphaTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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

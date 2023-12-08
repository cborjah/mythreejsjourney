import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
    materialColor: "#ffeded"
};

gui.addColor(parameters, "materialColor").onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
});

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
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");

// By default, WebGL will try to merge the pixels of the gradient.
// NearestFilter will NOT merge pixels. It will pick the pixel that closest matches  light intensity
gradientTexture.magFilter = THREE.NearestFilter;

//! The MeshToonMaterial is one of the Three.js materials that appears only when there is light
const material = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture,
    color: parameters.materialColor
});

// Meshes
const objectsDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3); // Need 3 values per particle (x,y,z)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] =
        objectsDistance * 0.5 -
        Math.random() * objectsDistance * sectionMeshes.length +
        0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 8;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Makes element transparent
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);
    console.log(
        "🚀 ~ file: script.js:164 ~ window.addEventListener ~ newSection:",
        newSection
    );

    if (newSection != currentSection) {
        currentSection = newSection;

        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: "power2.inOut",
            x: "+=6",
            y: "+=3",
            z: "+=1.5"
        });
    }
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", event => {
    // Divide by window width and height to make values consistent regardless of the resolution
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Adding the parallax feature broke the scroll based animations.
 * To fix that, put the camera in a Group and apply the parallax on the group and
 * not the camera itself.
 */

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime; // time elapsed between each frame (framerate)
    previousTime = elapsedTime;

    // Animate camera
    camera.position.y = (-scrollY / sizes.height) * objectsDistance;

    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;

    // Instead of apply the parallax on the camera, apply it on cameraGroup
    // cameraGroup.position.x = parallaxX;
    // cameraGroup.position.y = parallaxY;

    // Easing
    // parallaxX and parallaxY is the destination. Subtract the cameraGroup positions to get the
    // distance of the actual position to the destination.
    // To move a tenth of the delta, multiply by 0.1
    // To make animation consistant regardless of monitor framerate, make the animation
    // based on the framerate.
    cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 2 * deltaTime;
    cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * 2 * deltaTime;

    // Animate meshes
    for (const mesh of sectionMeshes) {
        // mesh.rotation.x = elapsedTime * 0.12;
        // mesh.rotation.y = elapsedTime * 0.1;

        mesh.rotation.x += deltaTime * 0.12;
        mesh.rotation.y += deltaTime * 0.1;
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

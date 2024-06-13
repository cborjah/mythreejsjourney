import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Materials
    particlesMaterial.uniforms.uResolution.value.set(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
    );

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(0, 0, 18);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setClearColor("#181818");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Displacement
 */
const displacement = {};

// 2D canvas
displacement.canvas = document.createElement("canvas");

// NOTE: When particles are displaced they remain displaced for a set amount of time.
// Because of this trail effect, you can't just send the cursor coordinate to the
// shader and use it to move the particles.
// You need some kind of persistence effect.
// Use the canvas to do so.

// TODO:
// Create a 2D canvas filled with black
// Draw a white glow on each frame where the cursor is
// Fade out the whole canvas slightly on each frame
// Use that canvas as a displacement texture for the particles

// NOTE: Don't make the canvas size larger than the amount of particles to maintain performance.
displacement.canvas.width = 128;
displacement.canvas.height = 128;

displacement.canvas.style.position = "fixed";
displacement.canvas.style.width = "256px"; // Doesn't change the actual width of the canvas. This 'stretches' the canvas.
displacement.canvas.style.height = "256px";
displacement.canvas.style.top = 0;
displacement.canvas.style.left = 0;
displacement.canvas.style.zIndex = 10;
document.body.append(displacement.canvas);

// Context
// The canvas' context is required to draw on it.
displacement.context = displacement.canvas.getContext("2d");
displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height
);

// NOTE: In this case don't use Three.js to load the texture. Three.js will create the mip mapping, etc. which
// is unecessary and will decrease performance.
// Load it in the native JavaScript way.

// Glow image
displacement.glowImage = new Image();
displacement.glowImage.src = "./glow.png";

// NOTE: The Raycaster won't work with the particles because it requires a geometry made out of vertices and triangles.
// Create a plane at the exact same position as the particles (on top), make it invisible, and use the Raycaster on that plane.

// Interactive plane
displacement.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10), // Limit the number of vertices to help performance.
    new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide })
);
displacement.interactivePlane.visible = false;
scene.add(displacement.interactivePlane);

// Raycaster
displacement.raycaster = new THREE.Raycaster();

// Coordinates
displacement.screenCursor = new THREE.Vector2(9999, 9999); // Set the default position far away outside of the whole experience.
displacement.canvasCursor = new THREE.Vector2(9999, 9999); // Set the default position far away outside of the whole experience.

window.addEventListener("pointermove", (event) => {
    // NOTE: Convert the screen coordinates (which are in pixels) to clip space coordinates (from -1 to +1).

    // TODO:
    // Divide clientX and clientY so that the values go from 0 to 1.
    // Multiply by 2 to get 0 to 2.
    // Subtract/Add one to get -1 to 1.
    displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
    displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1; // Remember that clientY values are inverted. (Starts at 0 at the top, you want the opposite)
});

// Texture
displacement.texture = new THREE.CanvasTexture(displacement.canvas); // Create a texture out of the canvas.

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);

// When using a geometry for particles, you may need to get rid of the index to improve performance.
// Doing this will reduce the number of vertices.
particlesGeometry.setIndex(null); // Set Three.js to stop using indexes, and tells the GPU to ignore the index.
particlesGeometry.deleteAttribute("normal"); // The normal is not used, therefore it should not be sent to the GPU.

const intensitiesArray = new Float32Array(
    particlesGeometry.attributes.position.count
);

const anglesArray = new Float32Array(
    particlesGeometry.attributes.position.count
);

for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
    intensitiesArray[i] = Math.random();
    anglesArray[i] = Math.random() * Math.PI * 2; // Radians for a full circle.
}

particlesGeometry.setAttribute(
    "aIntensity",
    new THREE.BufferAttribute(intensitiesArray, 1)
);
particlesGeometry.setAttribute(
    "aAngle",
    new THREE.BufferAttribute(anglesArray, 1)
);

const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uResolution: new THREE.Uniform(
            new THREE.Vector2(
                sizes.width * sizes.pixelRatio,
                sizes.height * sizes.pixelRatio
            )
        ),
        uPictureTexture: new THREE.Uniform(
            textureLoader.load("./picture-1.png")
        ),
        uDisplacementTexture: new THREE.Uniform(displacement.texture)
    }
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    /*
     * Raycaster
     */
    displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
    const intersections = displacement.raycaster.intersectObject(
        displacement.interactivePlane
    );

    if (intersections.length) {
        const uv = intersections[0].uv;

        // The uv coordinates go from 0 to 1 by default.
        // In this case you want the range to be 0 to 128.
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1.0 - uv.y) * displacement.canvas.height; // Invert the uv y values so it goes from 1 to 0 (top to bottom).
    }

    /**
     * Displacement
     */

    /**
     * Fade out effect when using a canvas
     * Fill the whole canvas with a black rectangle but with a low opacity.
     */
    displacement.context.globalCompositeOperation = "source-over"; // Reset globalCompositeOperation to default value.
    displacement.context.globalAlpha = 0.02;
    displacement.context.fillRect(
        0,
        0,
        displacement.canvas.width,
        displacement.canvas.height
    );

    // Draw glow
    const glowSize = displacement.canvas.width * 0.25; // Set glow size relative to canvas width.
    displacement.context.globalCompositeOperation = "lighten";
    displacement.context.globalAlpha = 1;
    displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5, // Center image on cursor.
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
    );

    // Texture
    displacement.texture.needsUpdate = true;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

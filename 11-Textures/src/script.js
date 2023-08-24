import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

THREE.ColorManagement.enabled = false;

/**
 * Textures
 */

// * Manual method
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//     // Create the texture outside of the function and update it once the image is loaded
//     texture.needsUpdate = true;
// };
// image.src = "/textures/door/color.jpg";

const loadingManager = new THREE.LoadingManager(); // Use a LoadingManager to mutualize events (load multiple textures)

loadingManager.onStart = () => {
    console.log("onStart");
};
loadingManager.onLoad = () => {
    console.log("onLoad");
};
loadingManager.onProgress = () => {
    console.log("onProgress");
};
loadingManager.onError = () => {
    console.log("onError");
};

// * TextureLoader method
const textureLoader = new THREE.TextureLoader(loadingManager);

// You can use 3 callbacks after the path (load, progress, error). Can use a LoadingManager instead of the callbacks.
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

/**
 * Mipmapping
 *
 * Mipmapping (or "mip mapping" with a space) is a technique that consists of creating half a
 * smaller version of a texture again and again until you get a 1x1 texture. All those texture
 * variations are sent to the GPU, and the GPU will choose the most appropriate version of the
 * texture.
 *
 * Since mipmapping produces a half smaller version of the texture repeatedly until a 1x1
 * iteration is reached, the texture's width and height must be a power of 2. Otherwise, the
 * texture will be resized which will cause unintended changes and worse performance.
 *
 * There are two types of filter algorithms: the minification filter and the magnification filter.
 *
 * The minification filter happens when the pixels of texture are smaller than the pixels of the
 * render. In other words, the texture is too big for the surface, it covers.
 *
 * The magnification filter works just like the minification filter, but when the pixels of the
 * texture are bigger than the render's pixels. In other words, the texture too small for the
 * surface it covers.
 *
 * The default is THREE.LinearMipmapLinearFilter. If you are not satisfied with how your texture
 * looks, you should try the other filters.
 *
 * THREE.NearestFilter is cheaper than the other ones, and you should get better performances
 * when using it.
 *
 *
 * Size
 *
 * * Try to keep the texture files as light as possible.
 * You can use compression websites and softwares like TinyPNG.
 *
 * Each pixel of the textures will have to be stored on the GPU regardless of the image weight.
 *
 * The color and alpha files can be combined into one if using a PNG, otherwise you will require
 * two separate JPGs.
 *
 * It is hard to find the right combination of texture formats and resolutions. It takes time to
 * address perfomance issues.
 *
 * ? Where to find textures ?
 * poliigon.com
 * 3dtextures.me
 * arroway-textures.ch
 *
 * You can also create your own using photos and 2D software like Photoshop or even procedural
 * textures with software like Substance Designer.
 */

colorTexture.generateMipmaps = false; // When using NearestFilter, you can disable mipmaps
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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

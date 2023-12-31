import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Three.js lets you create many primitive geometries, but when it comes to more complex shapes,
 * you should use a dedicated 3D software.
 *
 * GLTF is becoming the standard when it comes to real-time and most 3D softwares, game engines,
 * and libraries.
 *
 * You don't have to use GLTF in all cases.
 * Question the data needed, the weight of the file, how much time to decompress it, etc.
 */

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */

/**
 ** Draco Loader
 *
 * Uncompressed GLTF files will work as well. The Draco decoder is only loaded when needed.
 *
 * Draco compression is not a win-win situation.
 * Geometries are light but the user has to load the DRACOLoader class and the decoder.
 * It takes time and resources for the computer to decode a compresed file.
 * It is mostly worth it when loading large files. (This tool is situational!)
 */

const dracoLoader = new DRACOLoader(); //! Must be BEFORE instantiating GLTF loader
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// gltfLoader.load("/models/Duck/glTF/Duck.gltf", gltf => {
//     console.log(gltf);
//     scene.add(gltf.scene.children[0]);
// });

//! Need DRACOLoader instance
// gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", gltf => {
//     scene.add(gltf.scene);
// });

// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", gltf => {
//     console.log(gltf);
//     // scene.add(gltf.scene.children[0]); // Causes issue where part of children is added to scene. Once it is added to our scene, it is removed from it's original scene, therefore the array is shortened. This causes the for loop to end before loading every item.

//     // Use a while loop to load everything
//     // while (gltf.scene.children.length) {
//     //     scene.add(gltf.scene.children[0]);
//     // }

//     //* Another solution is to duplicate the children array
//     // const children = [...gltf.scene.children];
//     // for (const child of children) {
//     //     scene.add(child);
//     // }

//     //* Best solution is to add the scene property to your scene
//     scene.add(gltf.scene);
// });

let mixer = null;

gltfLoader.load("/models/Fox/glTF/Fox.gltf", gltf => {
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    // const action = mixer.clipAction(gltf.animations[1]);
    // const action = mixer.clipAction(gltf.animations[2]);

    action.play();

    //* It is not good practice to mess with the scale of the children, scale the loaded scene instead
    gltf.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(gltf.scene);
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: "#444444",
        metalness: 0,
        roughness: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update mixer
    if (mixer != null) {
        mixer.update(deltaTime);
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

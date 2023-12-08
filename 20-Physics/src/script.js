import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";

/**
 *? Popular physics libraries
 *************
 * Ammo.js   *
 * Cannon.js *
 * Oimo.js   *
 *************
 */

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};

debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    });
};
gui.add(debugObject, "createSphere");

debugObject.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    });
};
gui.add(debugObject, "createBox");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.png",
    "/textures/environmentMaps/0/nx.png",
    "/textures/environmentMaps/0/py.png",
    "/textures/environmentMaps/0/ny.png",
    "/textures/environmentMaps/0/pz.png",
    "/textures/environmentMaps/0/nz.png"
]);

/**
 * Physics
 *
 * In Three.js you create Meshes, in Cannon you create Bodies.
 * But first you need to create a shape.
 */
// World
const world = new CANNON.World();

/**
 * Broadphase
 *
 * When testing the collisions between objects, a naive approach is testing every Body against
 * every other Body. While this is easy to do, it's costly in terms of performance.
 *
 * That is where broadphase comes up. The broadphase is doing a rough sorting of the Bodies before
 * testing them. Imagine having two piles of boxes far from each other. Why would you test the boxes
 * from one pile against the boxes in the other pile? They are too far to be colliding.
 *
 * There are 3 broadphase algorithms available in Cannon.js:
 *
 * NaiveBroadphase (Default): Tests every Bodies against every other Bodies
 * GridBroadphase: Quadrilles the world and only tests Bodies against other Bodies in the same grid
 * box or the neighbors' grid boxes.
 * SAPBroadphase (Recommended) (Sweep and prune broadphase): Tests Bodies on arbitrary axes during
 * multiples steps.
 *
 *! Using SAPBroadphase can eventually generate bugs where a collision doesn't
 *! occur, but it's rare, and it involves doing things like moving Bodies very fast.
 */
world.broadphase = new CANNON.SAPBroadphase(world);

/**
 * Sleep
 *
 ** Even if using an improved broadphase algo, all Bodies are tested, even those not moving.
 * When the Body speed gets really slow the Body can fall asleep and won't be tested unless
 * a sufficient force is applied.
 *
 * You can control how likely a Body will fall asleep with the sleepSpeedLimit and sleepTimeLimit
 * properties.
 */
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Materials
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic");

// Refactored into one material
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7 // Bounce
    }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial; // Set default material for all bodies in world

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// floorBody.material = defaultMaterial;
floorBody.mass = 0; // This object is static and won't move. Default mass is 0, so this line can be omitted.
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
});

const createSphere = (radius, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    });
    body.position.copy(position);
    world.addBody(body);

    // Save in objects to update array
    objectsToUpdate.push({
        mesh,
        body
    });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
});

const createBox = (width, height, depth, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    ); //! Use half of each dimension
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    });
    body.position.copy(position);
    world.addBody(body);

    // Save in objects to update array
    objectsToUpdate.push({
        mesh,
        body
    });
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime; // How much time elapsed since last tick
    oldElapsedTime = elapsedTime;

    // Update physics world
    // step: Step the physics world forward in time.
    world.step(1 / 60, deltaTime, 3); // (params - delta time, time elapsed since last call, max num of steps to take per function call)

    for (const object of objectsToUpdate) {
        //! Update mesh to move with its body
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion); // Rotation
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

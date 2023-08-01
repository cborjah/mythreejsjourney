const scene = new THREE.Scene();

// To create a visible object, create a Mesh.

// Start with a BoxGeometry and a MeshBasicMaterial.
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });

// Pass the newly created geometry and material into the Mesh.
const mesh = new THREE.Mesh(geometry, material);

// Don't forget to add the Mesh to the scene!
scene.add(mesh);

/**
 * Camera
 *  - Adds a point of view.
 *  - Not visible.
 *  - Serve as a point of view when doing a render.
 *  - Can have multiple and switch between them.
 *  - PerspectiveCamera is a default type.
 *
 * 45 - 55 degrees is a good starting point for the FOV.
 */
const fov = 75;
const sizes = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height); // (FOV (degrees), Aspect Ratio (width / height))

// Initially the Camera and box Mesh are placed together at the origin.
// Therefore, the Camera is INSIDE the Mesh at the moment. Move it.
camera.position.z = 3;

// Don't forget to add it to the Scene!
scene.add(camera);

/**
 * Renderer
 *  - Renders the scene from the camera POV.
 *  - Result will be drawn onto a canvas.
 *  - A canvas is a HTML element in which you can draw.
 *  - Three.js will use WebGL to draw the render inside the canvas.
 *  - You can create it manually or let Three.js handle it.
 *  - Will automatically set the size for the canvas.
 */
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height); // Resizing the Renderer. When you resize the Renderer, you resize the Canvas

// Now render the scene and camera.
renderer.render(scene, camera);

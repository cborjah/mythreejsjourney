import * as THREE from "three";
import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ wireframe: false })
        );
        this.scene.add(testMesh);

        this.resources.on("ready", () => {
            // Setup
            this.floor = new Floor(); // Place before instantiating the environment in order to properly set environment maps
            this.environmnent = new Environment();
        });
    }
}

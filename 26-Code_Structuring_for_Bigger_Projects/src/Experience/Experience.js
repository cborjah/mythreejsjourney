import * as THREE from "three";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import Debug from "./Utils/Debug.js";
import sources from "./sources.js";

let instance = null;

export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance;
        }

        instance = this;

        // Global access for debugging
        window.experience = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        // Sizes resize event
        this.sizes.on("resize", () => {
            this.resize();
        });

        // Time tick event
        this.time.on("tick", () => {
            this.update();
        });
    }

    resize() {
        this.camera.resize(); // Update camera BEFORE renderer to avoid bugs
        this.renderer.resize();
    }

    update() {
        this.camera.update(); // Update camera BEFORE renderer to avoid bugs
        this.world.update();
        this.renderer.update();
    }

    destroy() {
        this.sizes.off("resize");
        this.time.off("tick");

        // Traverse the whole scene
        this.scene.traverse(child => {
            /**
             * - Test if its a Mesh.
             * - Call the dispose() func on the geometry property.
             * - Loop through every key of the material property.
             * - If there is a dispose() func available on that key, call it.
             *
             * This is a very minimalist way of destroying everything in a scene.
             * You might find that there will be exceptions within specific classes.
             *
             ** Usually each class will have its own destroy method.
             */
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                for (const key in child.material) {
                    const value = child.material[key];

                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                }
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }
}

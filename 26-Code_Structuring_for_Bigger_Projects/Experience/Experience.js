import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";

export default class Experience {
    constructor(canvas) {
        // Options
        this.canvas = canvas;

        // Setup
        this.sizes = new Sizes();
        this.time = new Time();

        // Sizes resize event
        this.sizes.on("resize", () => {
            this.resize();
        });

        // Time tick event
        this.time.on("tick", () => {
            this.update();
        });
    }

    resize() {}

    update() {}
}

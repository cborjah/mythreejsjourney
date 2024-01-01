import Sizes from "./Utils/Sizes.js";

export default class Experience {
    constructor(canvas) {
        // Options
        this.canvas = canvas;

        // Setup
        this.sizes = new Sizes();

        this.sizes.asdasdfon("resize", () => {
            console.log("I heard a resize");
        });
    }
}

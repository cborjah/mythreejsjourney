import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsedTime = 0;
        this.delta = 16; // How much time was spent since the previous frame (16 by default because it is close to how many milliseconds there is between two frames at 60 fps)

        // Allows one tick to pass before invoking tick method so delta won't be 0
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.state;

        this.trigger("tick");

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
}

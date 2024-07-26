import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import Experience from "./Experience";

const root = ReactDOM.createRoot(document.querySelector("#root"));

/**
 * Pixel Ratio
 *
 * NOTE: R3F handles the pixel ratio automatically!
 * It's good practice to clamp it in order to avoid performance issues on devices
 * with a very high pixel ratio.
 */

root.render(
    <Canvas
        // dpr={[1, 2]} // Passing an array gives a clamped range for the values. [1, 2] is the DEFAULT value.
        // flat // Setting this property to true results in no tone mapping.
        gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping
            // outputColorSpace: THREE.LinearSRGBColorSpace
        }}
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [3, 2, 6]
        }}
    >
        <Experience />
    </Canvas>
);

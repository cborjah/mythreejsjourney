import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import Experience from "./Experience";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
    <Canvas
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

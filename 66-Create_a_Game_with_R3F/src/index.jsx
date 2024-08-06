import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

/*
 * KeyboardControls
 *
 * NOTE: <KeyboardControls /> needs to wrap EVERY component that has to be
 *       aware of which keys are being pressed.
 *
 * The map attribute is an array that needs each key that needs to be
 * observed.
 */

root.render(
    <KeyboardControls
        map={[
            {
                name: "forward",
                keys: ["ArrowUp", "KeyW"]
            },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "jump", keys: ["Space"] }
        ]}
    >
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [2.5, 4, 6]
            }}
        >
            <Experience />
        </Canvas>
        <Interface />
    </KeyboardControls>
);

import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
// import Model from "./Model";
import Placeholder from "./Placeholder";
import Hamburger from "./Hamburger";
import Fox from "./Fox";

/*
 * Lazy Loading using <Suspense> is tricky because it needs
 * to be wrapping a component.
 *
 * You can set a fallback to display something while the
 * component is loading.
 *
 *
 * Shadow Acne
 *
 * When an object casts shadows on itself due to precision
 * inaccuracies. Set the 'shadow-normalBias' to fix this.
 */

export default function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight
                castShadow
                position={[1, 2, 3]}
                intensity={4.5}
                shadow-normalBias={0.04}
            />
            <ambientLight intensity={1.5} />

            <mesh
                receiveShadow
                position-y={-1}
                rotation-x={-Math.PI * 0.5}
                scale={10}
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <Suspense
                fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}
            >
                <Hamburger scale={0.35} />
            </Suspense>

            <Fox />
        </>
    );
}

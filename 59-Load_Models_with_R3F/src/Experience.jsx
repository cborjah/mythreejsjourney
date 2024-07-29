import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Model from "./Model";
import Placeholder from "./Placeholder";

/*
 * Lazy Loading using <Suspense> is tricky because it needs
 * to be wrapping a component.
 *
 * You can set a fallback to display something while the
 * component is loading.
 */

export default function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
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
                <Model />
            </Suspense>
        </>
    );
}

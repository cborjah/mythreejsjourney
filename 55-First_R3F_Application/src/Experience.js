import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Experience() {
    const cubeRef = useRef();

    // useFrame will be called on each frame BEFORE rendering the scene regardless of current frame rat regardless of current frame rate.
    useFrame((state, delta) => {
        // delta is how much time has passed since the last frame
        cubeRef.current.rotation.y += delta;
    });

    /**
     * Geometry construction parameters can be changed by providing an array to the 'args'
     * attribute, in this case following the order (radius, widthSegments, heightSegments).
     *
     * Use the Three.js documentation as a reference on how to pass in the args.
     *
     * NOTE: In the case of geometries, take care not to update their values
     * too often or animate them. Each change will result in the whole
     * geometry being destroyed and recreated.
     *
     * The order of meshes aren't relevant unlike in native Three.js.
     */

    return (
        <>
            <mesh position-x={-2}>
                <sphereGeometry />
                <meshBasicMaterial color="orange" />
            </mesh>

            <mesh
                ref={cubeRef}
                rotation-y={Math.PI * 0.25}
                position-x={2}
                scale={1.5}
            >
                <boxGeometry scale={1.5} />
                <meshBasicMaterial color="mediumpurple" />
            </mesh>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color="greenyellow" />
            </mesh>
        </>
    );
}

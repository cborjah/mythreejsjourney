import { useRef } from "react";
import { useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./CustomObject";

/**
 * OrbitControls is NOT part of the default Three.js classes (in the THREE variable).
 * It can NOT be declared like a <orbitControls>.
 *
 * Import it and 'convert' it to a declarative version.
 */
extend({ OrbitControls }); // No need to use camelCase, R3F will handle that automatically.

export default function Experience() {
    const { camera, gl } = useThree(); // The useThree hook returns the same data as the 'state' in the useFrame hook.
    const cubeRef = useRef();
    const groupRef = useRef();

    // useFrame will be called on each frame BEFORE rendering the scene regardless of
    // current frame rate regardless of current frame rate.
    useFrame((state, delta) => {
        // delta is how much time has passed since the last frame
        cubeRef.current.rotation.y += delta;
        // groupRef.current.rotation.y += delta;
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
            <orbitControls args={[camera, gl.domElement]} />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <group ref={groupRef}>
                <mesh position-x={-2}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>

                <mesh
                    ref={cubeRef}
                    rotation-y={Math.PI * 0.25}
                    position-x={2}
                    scale={1.5}
                >
                    <boxGeometry scale={1.5} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </group>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <CustomObject />
        </>
    );
}

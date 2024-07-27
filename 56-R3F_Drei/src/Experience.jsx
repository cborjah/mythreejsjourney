import { useRef } from "react";
import { OrbitControls, TransformControls } from "@react-three/drei";

/**
 * TransformControls should be placed after the object it will be applied to.
 *
 * NOTE: Setting the 'makeDefault' property for OrbitControls to true in order to
 * prevent the camera from moving when using TransformControls. It tells
 * Three.js that it is the default control. This allows other helpers to
 * access the default controls and decide whether or not to deactivate it.
 */

export default function Experience() {
    const cubeRef = useRef();

    return (
        <>
            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh ref={cubeRef} position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <TransformControls object={cubeRef} mode="translate" />

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}

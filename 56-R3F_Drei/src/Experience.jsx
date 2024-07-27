import { useRef } from "react";
import {
    Html,
    OrbitControls,
    TransformControls,
    PivotControls
} from "@react-three/drei";

/**
 * TransformControls should be placed after the object it will be applied to.
 *
 * PivotControls is NOT a group.
 * PivotControls doens't work as a group like for the TransformControls.
 * In order to center it to an object, you need to change its position
 * using the 'anchor' attribute.
 * Set 'depthTest' to false in order to force it to render ontop of
 * everything.
 * The 'anchor' property is relative to the object.
 *
 * NOTE: Setting the 'makeDefault' property for OrbitControls to true in order to
 * prevent the camera from moving when using TransformControls. It tells
 * Three.js that it is the default control. This allows other helpers to
 * access the default controls and decide whether or not to deactivate it.
 */

export default function Experience() {
    const cubeRef = useRef();
    const sphereRef = useRef();

    return (
        <>
            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <PivotControls
                anchor={[0, 0, 0]}
                depthTest={false}
                lineWidth={4}
                axisColors={["#9381ff", "#ff4d6d", "#7ae582"]}
                scale={100}
                fixed={true}
            >
                <mesh ref={sphereRef} position-x={-2}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                    <Html
                        wrapperClass="label"
                        position={[1, 1, 0]}
                        center
                        distanceFactor={6}
                        occlude={[sphereRef, cubeRef]}
                    >
                        That's a sphere!
                    </Html>
                </mesh>
            </PivotControls>

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

import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    // BallCollider,
    // CuboidCollider,
    Physics,
    RigidBody
} from "@react-three/rapier";
import { useRef } from "react";

/**
 * Rapier
 *
 * Rapier is fully cross-platform deterministic.
 *
 * Running the simulation with the same INITIAL conditions, same version of Rapier,
 * on two different machines (even with different browsers, operating systems, and
 * processors, will result in the same results (by default).
 * - https://rapier.rs/docs/user_guides/javascript/determinism/
 *
 *
 * React Three Fiber already implements Rapier as React Three Rapier thanks to the
 * PMDRS team!
 *
 *
 * Colliders are the shapes that make up the RigidBodies.
 * NOTE: Avoid using trimesh colliders with dynamic RigidBodies!
 *       Doing so will make collision detection more complicated
 *       and prone to bugs. Ex: A fast object might get through
 *       the trimesh or end up stuck on its surface.
 */

export default function Experience() {
    const cube = useRef();

    const cubeJump = () => {
        cube.current.applyImpulse({ x: 0, y: 5, z: 0 });
        cube.current.applyTorqueImpulse({ x: 0, y: Math.random() - 0.5, z: 0 });
    };

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug>
                <RigidBody colliders="ball">
                    <mesh castShadow position={[-1.5, 2, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody ref={cube} position={[1.5, 2, 0]}>
                    <mesh castShadow onClick={cubeJump}>
                        <boxGeometry />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                </RigidBody>

                <RigidBody type="fixed">
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>
            </Physics>
        </>
    );
}

import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody
} from "@react-three/rapier";

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
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug>
                <RigidBody colliders="ball">
                    <mesh castShadow position={[0, 4, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    colliders={false}
                    position={[0, 1, 0]}
                    rotation={[Math.PI * 0.5, 0, 0]}
                >
                    {/* <BallCollider args={[1.5]} /> */}
                    {/* <CuboidCollider args={[1.5, 1.5, 0.5]} />
                    <CuboidCollider
                        args={[0.25, 1, 0.25]}
                        position={[0, 0, 1]}
                        rotation={[-Math.PI * 0.35, 0, 0]}
                    />  */}
                    <mesh castShadow>
                        <torusGeometry args={[1, 0.5, 16, 32]} />
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

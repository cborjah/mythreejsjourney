import * as THREE from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    CylinderCollider,
    CuboidCollider,
    // BallCollider,
    // CuboidCollider,
    Physics,
    RigidBody,
    InstancedRigidBodies
} from "@react-three/rapier";
import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

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
 *
 *
 * Restitution controls the bounciness of an object.
 *
 *
 * NOTE: In order to set an object's mass, you need to use a custom collider.
 *
 * NOTE: For dynamic and fixed objects, don't change their position and rotation
 *       values at run time. Their purpose is only to set the original position
 *       and rotation before letting Rapier update the objects.
 *       Apply forces to an object to move them!
 *
 *
 * Kinematic objects will only move if a force is applied on them, not by other
 * objects hitting them.
 *
 *
 * When an object stops moving for a moment, Rapier will consider it as sleeping
 * and won't update it unless it collides with something else or a function like
 * applyImpulse is called on it.
 */

export default function Experience() {
    const [hitSound] = useState(() => {
        return new Audio("./hit.mp3");
    }); // The hit sound is created using useState to prevent it from being created on each rerender.
    const cube = useRef();
    const twister = useRef();

    const cubeJump = () => {
        const mass = cube.current.mass();
        cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
        cube.current.applyTorqueImpulse({ x: 0, y: Math.random() - 0.5, z: 0 });
    };

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const eulerRotation = new THREE.Euler(0, time * 3, 0);
        const quaternionRotation = new THREE.Quaternion();
        quaternionRotation.setFromEuler(eulerRotation);
        twister.current.setNextKinematicRotation(quaternionRotation);

        const angle = time * 0.5;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
    });

    const collisionEnter = () => {
        /* hitSound.currentTime = 0;
        hitSound.volume = Math.random();
        hitSound.play(); */
    };

    const hamburger = useGLTF("./hamburger.glb");

    const cubesCount = 100;
    const instances = useMemo(() => {
        const instances = [];

        for (let i = 0; i < cubesCount; i++) {
            instances.push({
                key: "instance_" + i,
                position: [
                    (Math.random() - 0.5) * 8,
                    6 + i * 0.2,
                    (Math.random() - 0.5) * 8
                ],
                rotation: [Math.random(), Math.random(), Math.random()]
            });
        }

        return instances;
    }, []);

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug={false}>
                <RigidBody colliders="ball">
                    <mesh castShadow position={[-1.5, 2, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    ref={cube}
                    position={[1.5, 2, 0]}
                    gravityScale={1}
                    restitution={0}
                    friction={0.7}
                    colliders={false}
                    onCollisionEnter={collisionEnter}
                    onCollisionExit={() => {}}
                    onSleep={() => {}}
                    onWake={() => {}}
                >
                    <mesh castShadow onClick={cubeJump}>
                        <boxGeometry />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <CuboidCollider args={[0.5, 0.5, 0.5]} mass={2} />
                </RigidBody>

                <RigidBody type="fixed" friction={0.7}>
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    ref={twister}
                    position={[0, -0.8, 0]}
                    friction={0}
                    type="kinematicPosition"
                >
                    <mesh castShadow scale={[0.4, 0.4, 3]}>
                        <boxGeometry />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>

                <RigidBody position={[0, 4, 0]} colliders={false}>
                    <primitive object={hamburger.scene} scale={0.25} />
                    <CylinderCollider args={[0.5, 1.25]} />
                </RigidBody>

                <RigidBody type="fixed">
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                    <CuboidCollider
                        args={[5, 2, 0.5]}
                        position={[0, 1, -5.5]}
                    />
                    <CuboidCollider
                        args={[0.5, 2, 5]}
                        position={[5.25, 1, 0]}
                    />
                    <CuboidCollider
                        args={[0.5, 2, 5]}
                        position={[-5.25, 1, 0]}
                    />
                </RigidBody>

                <InstancedRigidBodies instances={instances}>
                    <instancedMesh args={[null, null, cubesCount]} castShadow>
                        <boxGeometry />
                        <meshStandardMaterial color="tomato" />
                    </instancedMesh>
                </InstancedRigidBodies>
            </Physics>
        </>
    );
}

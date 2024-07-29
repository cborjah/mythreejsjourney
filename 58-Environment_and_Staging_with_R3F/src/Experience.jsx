import { useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper, BakeShadows } from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";

export default function Experience() {
    const cube = useRef();

    const directionalLight = useRef();
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2;
    });

    return (
        <>
            <BakeShadows />

            {/* Another way to add a background color. It must be attached for it to work. */}
            <color args={["ivory"]} attach="background" />

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight
                ref={directionalLight}
                position={[1, 2, 3]}
                intensity={4.5}
                castShadow={true}
            />
            <ambientLight intensity={1.5} />

            <mesh position-x={-2} castShadow={true}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh ref={cube} position-x={2} scale={1.5} castShadow={true}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh
                position-y={-1}
                rotation-x={-Math.PI * 0.5}
                scale={10}
                receiveShadow={true}
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}

import { useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    useHelper,
    // BakeShadows,
    // SoftShadows,
    // AccumulativeShadows,
    // RandomizedLight,
    ContactShadows
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";

/**
 * Percent Closer Soft Shadows (PCSS)
 *
 * Makes shadows look blurry by picking the shadow map texture at an offset
 * position according to the distance between the surface casting the shadow
 * and the surface receiving the shadow.
 *
 *
 * Accumulative Shadows
 *
 * Accumulates multiple shadow renders where the light is moved randomly before
 * each render. The shadow will be composed of multiple renders from various angles
 * making it look soft and realistic.
 * NOTE: Can only be rendered on a PLANE.
 *       Make sure to remove any existing shadows on the plane.
 *       Make sure to place it slightly above the plane to prevent z-fighting.
 *       Requires its own lights!
 *
 *
 *  Contact Shadows
 *
 *  Renders the whole scene similar to how the directional light does,
 *  but with the camera taking place of the floor instead of the light.
 *  It'll then blur the shadow map to make it look better.
 *
 *  NOTE: Works without a light and ONLY on a plane.
 */

export default function Experience() {
    const cube = useRef();

    const directionalLight = useRef();

    useHelper(directionalLight, THREE.DirectionalLightHelper, 1); // NOTE: Can cause artifacts when using with AccumulativeShadows

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2;
    });

    return (
        <>
            {/*<BakeShadows />*/}
            {/*<SoftShadows size={25} samples={17} focus={0.25} />*/}

            {/* Another way to add a background color. It must be attached for it to work. */}
            <color args={["ivory"]} attach="background" />

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            {/*
                <AccumulativeShadows
                    position={[0, -0.99, 0]}
                    scale={10}
                    color="#316d39"
                    opacity={0.8}
                    frames={Infinity}
                    temporal={true}
                    blend={100}
                >
                    <RandomizedLight
                        position={[1, 2, 3]}
                        amount={8}
                        radius={1}
                        ambient={0.5}
                        intensity={3}
                        bias={0.001}
                    />
                </AccumulativeShadows>
           */}

            <ContactShadows
                position={[0, -0.99, 0]}
                scale={10}
                resolution={512}
                far={5}
            />

            <directionalLight
                ref={directionalLight}
                position={[1, 2, 3]}
                intensity={4.5}
                castShadow={true}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={5}
                shadow-camera-right={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
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
                // receiveShadow={true}
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}

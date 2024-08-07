import { useFrame, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    useHelper,
    // BakeShadows,
    // SoftShadows,
    // AccumulativeShadows,
    // RandomizedLight,
    ContactShadows,
    // Sky,
    Environment,
    Lightformer,
    Stage
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from "leva";

/**
 *
 * Percent Closer Soft Shadows (PCSS)
 *
 * Makes shadows look blurry by picking the shadow map texture at an offset
 * position according to the distance between the surface casting the shadow
 * and the surface receiving the shadow.
 *
 **********************************************************************************
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
 **********************************************************************************
 *
 *  Contact Shadows
 *
 *  Renders the whole scene similar to how the directional light does,
 *  but with the camera taking place of the floor instead of the light.
 *  It'll then blur the shadow map to make it look better.
 *
 *  NOTE: Works without a light and ONLY on a plane.
 *        Shadows always come from the front of the plane.
 *        Not physically accurate.
 *        Blurs the shadow regardless of distance from objects.
 *        Impacts performance.
 *
 **********************************************************************************
 *
 *  Sun
 *
 *  NOTE: Use spherical coordinates when setting the sun position.
 *
 **********************************************************************************
 *
 *  Stage
 *
 *  Stage will set an environment map, shadows, two directional lights
 *  and center the scene.
 *
 */

export default function Experience() {
    const cube = useRef();

    const directionalLight = useRef();

    useHelper(directionalLight, THREE.DirectionalLightHelper, 1); // NOTE: Can cause artifacts when using with AccumulativeShadows

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2;
    });

    const { color, opacity, blur } = useControls("contact shadows", {
        color: "#4b2709",
        opacity: { value: 0.4, min: 0, max: 1 },
        blur: { value: 2.8, min: 0, max: 10 }
    });

    const { sunPosition } = useControls("sky", {
        sunPosition: { value: [1, 2, 3] }
    });

    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
        useControls("environment map", {
            envMapIntensity: { value: 3.5, min: 0, max: 12 },
            envMapHeight: { value: 7, min: 0, max: 100 },
            envMapRadius: { value: 20, min: 10, max: 1000 },
            envMapScale: { value: 100, min: 10, max: 1000 }
        });

    // Update the envMapIntensity of ALL the materials without having to set
    // it manually on each one by updating the scene's envMapIntensity.
    // useEffect(() => {
    //     scene.environmentIntensity = envMapIntensity;
    // }, [envMapIntensity]);

    const scene = useThree((state) => state.scene);

    return (
        <>
            {/* <Environment
                // background={true}
                // files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
                preset={"sunset"} // Comes with a list of hdr's for immediate use.
                // resolution={32}
                ground={{
                    height: envMapHeight,
                    radius: envMapRadius,
                    scale: envMapScale
                }}
            >
                <color args={["black"]} attach="background" />
                <Lightformer
                    position-z={-5}
                    scale={10}
                    color="red"
                    intensity={10}
                    form="ring"
                />
                // <mesh position-z={-5} scale={10}>
                //    <planeGeometry />
                //    <meshBasicMaterial color={[10, 0, 0]} />
                // </mesh>
            </Environment> */}

            {/*<BakeShadows />*/}
            {/*<SoftShadows size={25} samples={17} focus={0.25} />*/}

            {/* Another way to add a background color. It must be attached for it to work. */}
            {/* <color args={["ivory"]} attach="background" /> */}

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

            {/* <ContactShadows
                position={[0, 0, 0]}
                scale={10}
                resolution={512}
                far={5}
                color={color}
                opacity={opacity}
                blur={blur}
                frames={1}
            /> */}

            {/*<directionalLight
                ref={directionalLight}
                position={sunPosition}
                intensity={4.5}
                castShadow={true}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={5}
                shadow-camera-right={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
            /> */}
            {/* <ambientLight intensity={1.5} /> */}

            {/* <Sky sunPosition={sunPosition} /> */}

            <Stage
                shadows={{
                    type: "contact",
                    opacity: 0.2,
                    blur: 3
                }}
                environment="sunset"
                preset="portrait"
                intensity={envMapIntensity}
            >
                <mesh position-x={-2} position-y={1} castShadow={true}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>

                <mesh
                    ref={cube}
                    position-x={2}
                    position-y={1}
                    scale={1.5}
                    castShadow={true}
                >
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </Stage>

            {/* <mesh
                position-y={0}
                rotation-x={-Math.PI * 0.5}
                scale={10}
                // receiveShadow={true}
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh> */}
        </>
    );
}

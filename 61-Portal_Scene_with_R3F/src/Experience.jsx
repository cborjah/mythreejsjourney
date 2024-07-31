import { useRef } from "react";
import * as THREE from "three";
import {
    useGLTF,
    useTexture,
    OrbitControls,
    Center,
    Sparkles,
    shaderMaterial
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

/**
 * This method of using shaders integrates better with R3F.
 * The <portalmaterial /> can be used in multiple meshes and
 * the uniforms are easier to update.
 */
const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color("#ffffff"),
        uColorEnd: new THREE.Color("#000000")
    },
    portalVertexShader,
    portalFragmentShader
);

extend({ PortalMaterial: PortalMaterial }); // Creates a new tag available in R3F <portalMaterial />

export default function Experience() {
    const { nodes } = useGLTF("./model/portal.glb");
    // console.log(nodes);

    const bakedTexture = useTexture("./model/baked.jpg");
    bakedTexture.flipY = false;

    const portalMaterial = useRef();
    useFrame((state, delta) => {
        portalMaterial.current.uTime += delta;
    });

    return (
        <>
            <color args={["#030202"]} attach="background" />

            <OrbitControls makeDefault />

            <Center>
                <mesh geometry={nodes.baked.geometry}>
                    <meshBasicMaterial map={bakedTexture} />
                </mesh>

                <mesh
                    geometry={nodes.poleLightA.geometry}
                    position={nodes.poleLightA.position}
                >
                    <meshBasicMaterial color="#ffffe5" />
                </mesh>

                <mesh
                    geometry={nodes.poleLightB.geometry}
                    position={nodes.poleLightB.position}
                >
                    <meshBasicMaterial color="#ffffe5" />
                </mesh>

                <mesh
                    geometry={nodes.portalLight.geometry}
                    position={nodes.portalLight.position}
                    rotation={nodes.portalLight.rotation}
                >
                    <portalMaterial ref={portalMaterial} />
                </mesh>

                <Sparkles
                    size={6}
                    scale={[4, 2, 4]}
                    position-y={1}
                    speed={0.2}
                    count={40}
                />
            </Center>
        </>
    );
}

import { useGLTF, useTexture, OrbitControls, Center } from "@react-three/drei";

export default function Experience() {
    const { nodes } = useGLTF("./model/portal.glb");
    console.log(nodes.baked);

    const bakedTexture = useTexture("./model/baked.jpg");
    bakedTexture.flipY = false;

    return (
        <>
            <color args={["#030202"]} attach="background" />

            <OrbitControls makeDefault />

            <Center>
                <mesh geometry={nodes.baked.geometry}>
                    <meshBasicMaterial map={bakedTexture} />
                </mesh>
            </Center>
        </>
    );
}

import { useGLTF } from "@react-three/drei";

/**
 * NOTE: useGLTF will take care of everything.
 * No need to provide the DRACO decoder in the public folder!
 */

export default function Model() {
    const model = useGLTF("./hamburger-draco.glb");

    return <primitive object={model.scene} scale={0.35} position-y={-1} />;
}

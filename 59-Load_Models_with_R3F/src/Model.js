import { useGLTF, Clone } from "@react-three/drei";

/**
 * NOTE: useGLTF from the Drei library will take care of everything.
 * No need to provide the DRACO decoder in the public folder!
 *
 * NOTE: Use 'Clone' to create multiple instances of an object while
 * keeping the amount of geometries and shaders the same.
 */

export default function Model() {
    const model = useGLTF("./hamburger-draco.glb");

    return (
        <>
            <Clone object={model.scene} scale={0.35} position-x={-4} />
            <Clone object={model.scene} scale={0.35} position-x={0} />
            <Clone object={model.scene} scale={0.35} position-x={4} />
        </>
    );
}

useGLTF.preload("./hamburger-draco.glb");

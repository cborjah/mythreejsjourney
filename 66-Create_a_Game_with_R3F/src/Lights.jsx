import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lights() {
    const light = useRef();

    useFrame((state) => {
        /**
         * Since the light is focusing on the camera, a significant part
         * of the shadow map is used behind the camera. Move the light and
         * target forward a bit with (-4)
         */
        light.current.position.z = state.camera.position.z + 1 - 4;
        light.current.target.position.z = state.camera.position.z - 4;

        /**
         * NOTE: Changing the light's target does NOT mean the transformation
         * matrix is automatically updated.
         *
         * Three.js updates object matrices only if their transformation
         * coordinates (position, rotation, scale) change AND are in the
         * scene. The light is in the scene, but NOT the target.
         *
         * Either add the target to the scene or update the matrix manually
         * like below.
         */
        light.current.target.updateMatrixWorld();
    });

    return (
        <>
            <directionalLight
                ref={light}
                castShadow
                position={[4, 4, 1]}
                intensity={4.5}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={10}
                shadow-camera-right={10}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}
            />
            <ambientLight intensity={1.5} />
        </>
    );
}

import { useEffect } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";

export default function Fox() {
    const fox = useGLTF("./Fox/glTF/Fox.gltf");
    const animations = useAnimations(fox.animations, fox.scene);

    useEffect(() => {
        const action = animations.actions.Run;
        action.play();

        setTimeout(() => {
            animations.actions.Walk.play();
            animations.actions.Walk.crossFadeFrom(animations.actions.Run, 1);
        }, 2000);
    }, []);

    return (
        <primitive
            object={fox.scene}
            scale={0.02}
            position={[-2.5, 0, 2.5]}
            rotation-y={0.3}
        />
    );
}

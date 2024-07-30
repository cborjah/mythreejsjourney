import { useEffect } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from "leva";

export default function Fox() {
    const fox = useGLTF("./Fox/glTF/Fox.gltf");
    const animations = useAnimations(fox.animations, fox.scene);

    const { animationName } = useControls({
        // console.log(animations.names);

        animationName: { options: ["Survey", "Walk", "Run"] }
    });

    useEffect(() => {
        const action = animations.actions[animationName];

        // The reset() method ensures the animation starts from the beginning.
        action.reset().fadeIn(0.5).play();

        return () => {
            // NOTE: Make sure to dispose of the previous animation before transitioning to another.
            //       Otherwise, the previous animation will be mixed with the next.
            action.fadeOut(0.5);
        };
    }, [animationName]);

    return (
        <primitive
            object={fox.scene}
            scale={0.02}
            position={[-2.5, 0, 2.5]}
            rotation-y={0.3}
        />
    );
}

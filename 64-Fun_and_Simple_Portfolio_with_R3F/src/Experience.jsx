import {
    Html,
    ContactShadows,
    PresentationControls,
    Float,
    Environment,
    useGLTF
} from "@react-three/drei";

/*
 * PresentationControls let you manipulate the model instead of the camera.
 * It uses 'use-gesture', a library to interact with elements using natural
 * gestures.
 *
 * NOTE: This library recommends adding the CSS property 'touch-action' to
 *       'none' in order to fix weird behavior on mobile when swiping.
 *       Ex: Accidentally triggering 'swipe down to refresh'.
 *       Documentation: https://use-gesture.netlify.app/docs/extras/#touch-action
 */

export default function Experience() {
    const computer = useGLTF(
        "https://threejs-journey.com/resources/models/macbook_model.gltf"
    );

    return (
        <>
            <Environment preset="city" />

            <color args={["#241a1a"]} attach="background" />

            <PresentationControls
                global
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
            >
                <Float rotationIntensity={0.4}>
                    <primitive object={computer.scene} position-y={-1.2}>
                        <Html
                            transform
                            wrapperClass="htmlScreen"
                            distanceFactor={1.17}
                            position={[0, 1.56, -1.4]}
                            rotation-x={-0.256}
                        >
                            <iframe src="https://bruno-simon.com/html" />
                        </Html>
                    </primitive>
                </Float>
            </PresentationControls>

            <ContactShadows
                position-y={-1.4}
                opacity={0.4}
                scale={5}
                blur={2.4}
            />
        </>
    );
}

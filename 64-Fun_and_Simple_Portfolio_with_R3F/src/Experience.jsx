import {
    PresentationControls,
    Float,
    Environment,
    useGLTF
} from "@react-three/drei";

/*
 * PresentationControls let you manipulate the model instead of the camera.
 */

export default function Experience() {
    const computer = useGLTF(
        "https://threejs-journey.com/resources/models/macbook_model.gltf"
    );

    return (
        <>
            <Environment preset="city" />

            <color args={["#241a1a"]} attach="background" />

            <PresentationControls>
                <Float rotationIntensity={0.4}>
                    <primitive object={computer.scene} position-y={-1.2} />
                </Float>
            </PresentationControls>
        </>
    );
}

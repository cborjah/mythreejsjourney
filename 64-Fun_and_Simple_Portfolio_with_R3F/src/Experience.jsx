import { OrbitControls } from "@react-three/drei";

export default function Experience() {
    return (
        <>
            <color args={["#241a1a"]} attach="background" />

            <OrbitControls makeDefault />

            <mesh>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh>
        </>
    );
}

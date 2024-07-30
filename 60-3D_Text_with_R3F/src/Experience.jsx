import { Center, Text3D, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

export default function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />
            <Center>
                <Text3D font="./fonts/helvetiker_regular.typeface.json">
                    HELLO R3F
                    <meshNormalMaterial />
                </Text3D>
            </Center>
        </>
    );
}

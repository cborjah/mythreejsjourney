import {
    useMatcapTexture,
    Center,
    Text3D,
    OrbitControls
} from "@react-three/drei";
import { Perf } from "r3f-perf";

export default function Experience() {
    // Second parameter is the desired width if its available (64, 128, 256, 1024).
    // NOTE: 256 is more than enough (use the smallest possible).
    const [matcapTexture] = useMatcapTexture(
        "7B5254_E9DCC7_B19986_C8AC91",
        256
    );
    // console.log(matcapTexture);

    // NOTE: Array(100) creates an EMPTY array with a lenth of 100.
    //       Use the spread operator to create an array filled with undefined.
    const tempArray = [...Array(100)];
    tempArray.map(() => {});

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />
            <Center>
                <Text3D
                    font="./fonts/helvetiker_regular.typeface.json"
                    size={0.75}
                    height={0.2}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={5}
                >
                    HELLO R3F
                    <meshMatcapMaterial matcap={matcapTexture} />
                </Text3D>
            </Center>

            {[...Array(100)].map((_, index) => (
                <mesh
                    key={index}
                    position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ]}
                    scale={0.2 + Math.random() * 0.2}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        0
                    ]}
                >
                    <torusGeometry />
                    <meshMatcapMaterial matcap={matcapTexture} />
                </mesh>
            ))}
        </>
    );
}

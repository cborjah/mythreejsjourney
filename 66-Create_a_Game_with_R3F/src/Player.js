export default function Player() {
    return (
        <>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial color="mediumpurple" flatShading />
            </mesh>
        </>
    );
}

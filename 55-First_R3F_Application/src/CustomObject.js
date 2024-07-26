import * as THREE from "three";

export default function CustomObject() {
    const verticesCount = 10 * 3; // 3 vertices per triangle
    const positions = new Float32Array(verticesCount * 3); // Each vertex needs 3 values

    for (let i = 0; i < verticesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 3;
    }

    return (
        <mesh>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={verticesCount}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <meshBasicMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
    );
}

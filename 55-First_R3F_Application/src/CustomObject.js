import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export default function CustomObject() {
    const geometryRef = useRef();

    const verticesCount = 10 * 3; // 3 vertices per triangle

    const positions = useMemo(() => {
        const positions = new Float32Array(verticesCount * 3); // Each vertex needs 3 values

        for (let i = 0; i < verticesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3;
        }

        return positions;
    }, []);

    useEffect(() => {
        geometryRef.current.computeVertexNormals();
    }, []);

    return (
        <mesh>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={verticesCount}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <meshStandardMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
    );
}

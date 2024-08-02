import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

function BlockStart({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
        </group>
    );
}

function BlockSpinner({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow
            />
        </group>
    );
}

export default function Level() {
    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            <BlockSpinner position={[0, 0, 4]} />
        </>
    );
}

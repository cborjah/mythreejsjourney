import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

/**
 * Rapier
 *
 * Rapier is fully cross-platform deterministic.
 *
 * Running the simulation with the same INITIAL conditions, same version of Rapier,
 * on two different machines (even with different browsers, operating systems, and
 * processors, will result in the same results (by default).
 * - https://rapier.rs/docs/user_guides/javascript/determinism/
 *
 *
 * React Three Fiber already implements Rapier as React Three Rapier thanks to the
 * PMDRS team!
 *
 */

export default function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh castShadow position={[-2, 2, 0]}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh castShadow position={[2, 2, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh receiveShadow position-y={-1.25}>
                <boxGeometry args={[10, 0.5, 10]} />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}

import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    EffectComposer,
    ToneMapping,
    Vignette
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
// console.log(ToneMappingMode);

/**
 * In previous lessons, post-processing was done by adding passes where
 * each pass had its own code and was completing one or multiple renders.
 * Then the next pass would do the same.
 * These passes all occurred independently and some of them were doing the
 * same renders (depth renders, normal renders, etc.) which resulted in
 * performance issues.
 *
 *
 * EffectComposer
 *
 * Initially the colors will be off because the tone mapping will be
 * deactivated. When doing post-processing, you usually work with linear
 * colors and then apply tone mapping.
 *
 * R3F by default applies tone mapping, which is the ACES Filmic tone mapping.
 * The default tone mapping applied by ToneMapping is AgX.
 *
 * NOTE: It is possible to import things from postprocessing directly thanks to
 *       @react-three/postprocessing, but it's considered good practice to add
 *       it manually.
 *
 * NOTE: Keep <ToneMapping /> at the TOP inside of the <EffectComposer>!
 *
 * Multi-sampling is used to prevent the aliasing effect (stairs effect).
 */

export default function Experience() {
    return (
        <>
            <EffectComposer>
                <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                <Vignette offset={0.3} darkness={0.9} />
            </EffectComposer>

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh castShadow position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh castShadow position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh
                receiveShadow
                position-y={-1}
                rotation-x={-Math.PI * 0.5}
                scale={10}
            >
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}

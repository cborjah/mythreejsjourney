import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    EffectComposer,
    Glitch,
    ToneMapping,
    Vignette,
    Noise,
    Bloom,
    DepthOfField
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
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
 *
 * Multi-sampling is used to prevent the aliasing effect (stairs effect).
 *
 *
 * Noise
 *
 * 'premultiply' will multiply the noise with the input color before applying the
 * blending. It usually results in a darker render, but it blends better with the image.
 *
 *
 * Bloom
 *
 * By default, bloom makes objects glow only when their color channels go beyond
 * the 1 threshold.
 *
 * NOTE: Bloom doesn't work when placed AFTER <ToneMapping />.
 *       meshStandardMaterial is worse for performances than meshBasicMaterial.
 *       If you want a material that just glows, use a meshBasicMaterial.
 *       If you want a slight blur everywhere in the scene,
 *       set intensity to a low value (0.1) and luminanceThreshold to 0.
 *       When you want an object to bloom more, just multiply its color values to increase them.
 *
 * The mipmap blur will use the same mipmapping used for textures.
 * Smallers resolutions of the render will be combined into a bloom texture
 * that is then added to the initial render.
 * It looks great with good performance.
 */

export default function Experience() {
    return (
        <>
            <color args={["#ffffff"]} attach="background" />

            <EffectComposer>
                <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                {/* <Vignette
                    offset={0.3}
                    darkness={0.9}
                    blendFunction={BlendFunction.NORMAL}
                /> */}
                {/* <Glitch
                    delay={[0.5, 1]}
                    duration={[0.1, 0.3]}
                    strength={[0.2, 0.4]}
                    mode={GlitchMode.CONSTANT_MILD}
                /> */}
                {/* <Noise blendFunction={BlendFunction.SOFT_LIGHT} premultiply /> */}
                {/* <Bloom luminanceThreshold={1.1} mipmapBlur intensity={0.5} /> */}
                <DepthOfField
                    focusDistance={0.025}
                    focalLength={0.025}
                    bokehScale={6}
                />
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

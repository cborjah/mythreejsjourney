import { useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, meshBounds } from "@react-three/drei";
import { useRef } from "react";

/**
 * 'meshBounds' will create a theoretical sphere around a mesh(called
 * a bounding sphere) and the pointer events will be tested on that sphere
 * instead of testing the geometry of the mesh.
 *
 * This is a way to optimize pointer events used on complex geometries.
 *
 * NOTE: 'meshBounds' can only be used on SINGLE meshes, which is why it
 * can't be used on the hamburger in this case.
 *
 * If you have very complex geometries and you still need pointer events to
 * be accurate, you can use the BVH (Bounding Volume Hierarchy).
 *
 * This isn't just for raycasting and pointer events, it can be used for
 * physics, etc.
 *
 * NOTE: In this case, wrap the <Experience /> in index.jsx with <Bvh>.
 * That's all it takes for an immediate performance boost when
 * raycasting!
 */

export default function Experience() {
    const cube = useRef();
    const hamburger = useGLTF("./hamburger.glb");

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2;
    });

    const eventHandler = (event) => {
        console.log("the event has occured!");
        cube.current.material.color.set(
            `hsl(${Math.random() * 360}, 100%, 75%)`
        );
    };

    return (
        <>
            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh position-x={-2} onClick={(event) => event.stopPropagation()}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh
                ref={cube}
                raycast={meshBounds}
                position-x={2}
                scale={1.5}
                onClick={eventHandler}
                onPointerEnter={() => {
                    document.body.style.cursor = "pointer";
                }}
                onPointerLeave={() => {
                    document.body.style.cursor = "default";
                }}
            >
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <primitive
                object={hamburger.scene}
                scale={0.25}
                position-y={0.5}
                onClick={(event) => {
                    // console.log(`clicked on ${event.object.name}!`); // Get exact mesh that triggered the event
                    // console.log(event.eventObject); // Get object that triggered the event

                    event.stopPropagation();
                }}
            />
        </>
    );
}

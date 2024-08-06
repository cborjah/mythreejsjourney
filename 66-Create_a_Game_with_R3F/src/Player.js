import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

/**
 * NOTE: A RigidBody falls asleep after a few seconds of inaction.
 *       This would result in the 'ball' not moving even though
 *       the player presses the directional keys.
 *       Set the 'canSleep' attribute to false to prevent this.
 */

export default function Player() {
    const body = useRef();
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();

    /**
     * The following two vectors are created OUTSIDE of the useFrame function
     * because they will contain the position and target of the camera
     * through time.
     *
     * These values will be preserved for the instance of this component.
     */
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3());
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

    const jump = () => {
        // Get ball's position
        const origin = body.current.translation();

        // NOTE: Move ball's origin from its center PAST its bottom surface so
        //       the ray doesn't collide with the ball itself.
        origin.y -= 0.31;

        const direction = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(origin, direction);

        // 10 is the max distance of the ray
        // true sets the world to be considered 'solid'. This prevents the ray from starting
        // from INSIDE the floor in this case.
        const hit = world.castRay(ray, 10, true);
        // console.log(hit.timeOfImpact);

        // Use ray to test distance from entire world
        // NOTE: 0.15 is used so the player can still jump after the ball bounces
        //       off the floor.
        if (hit.timeOfImpact < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
        }
    };

    useEffect(() => {
        const unsubscribeJump = subscribeKeys(
            // Selector function
            (state) => state.jump,

            // Callback function
            (value) => {
                if (value) {
                    jump();
                }
            }
        );

        return unsubscribeJump;
    }, []);

    useFrame((state, delta) => {
        /**
         * Controls
         */
        const { forward, backward, leftward, rightward } = getKeys();

        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        /*
         * NOTE: Before applying forces, you need to handle the variation in frame
         * rates. If the same impulse is applied on a computer with a higher
         * frame rate, the 'ball' will move much faster because applyImpulse
         * will be called more often.
         */
        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }

        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }

        if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }

        body.current.applyImpulse(impulse);
        body.current.applyTorqueImpulse(torque);

        /*
         * Camera
         */
        const bodyPosition = body.current.translation();
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(bodyPosition);
        cameraPosition.z += 2.25;
        cameraPosition.y += 0.65;

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(bodyPosition);
        cameraPosition.y += 0.25;

        /*
         * Lerping (linear interpolation)
         *
         * Lerping is used to smooth out the camera animation
         * as it follows the player.
         *
         * The second arg is how close the value will get to the
         * destination. These smoothed coordinates are then copied
         * to the camera. Initially it was set to 0.1 (1/10), but
         * to account for the frame rate, it is multiplied by the
         * delta time. 0.1 was increased to 5 due to the value being
         * too small after its multiplied with delta.
         */
        smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

        state.camera.position.copy(smoothedCameraPosition);
        state.camera.lookAt(smoothedCameraTarget);
    });

    return (
        <RigidBody
            ref={body}
            position={[0, 1, 0]}
            colliders="ball"
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
            canSleep={false}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial color="mediumpurple" flatShading />
            </mesh>
        </RigidBody>
    );
}

import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
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

    useFrame((state, delta) => {
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
    });

    return (
        <RigidBody
            ref={body}
            position={[0, 1, 0]}
            colliders="ball"
            restitution={0.2}
            friction={1}
            canSleep={false}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial color="mediumpurple" flatShading />
            </mesh>
        </RigidBody>
    );
}

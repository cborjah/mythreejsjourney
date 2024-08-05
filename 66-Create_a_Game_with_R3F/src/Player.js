import { RigidBody } from "@react-three/rapier";

/**
 * NOTE: A RigidBody falls asleep after a few seconds of inaction.
 *       This would result in the 'ball' not moving even though
 *       the player presses the directional keys.
 *       Set the 'canSleep' attribute to false to prevent this.
 */

export default function Player() {
    return (
        <RigidBody
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

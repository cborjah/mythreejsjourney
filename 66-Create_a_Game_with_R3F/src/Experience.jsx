import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import { Level } from "./Level";
import Player from "./Player.js";

export default function Experience() {
    return (
        <>
            <Physics debug={false}>
                <Lights />
                <Level />
                <Player />
            </Physics>
        </>
    );
}

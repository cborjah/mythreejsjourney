import { useRef, useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import useGame from "./stores/useGame";

export default function Interface() {
    const time = useRef();

    const restart = useGame((state) => state.restart);
    const phase = useGame((state) => state.phase);

    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const jump = useKeyboardControls((state) => state.jump);

    /*
     * NOTE: R3F has the addEffect hook that can be used OUTSIDE of
     *       <Canvas>, that will be executed synchronously with useFrame.
     *
     * NOTE: Make sure to UNSUBSCRIBE from addeffect!
     */
    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            // This hook will only have access to the INITIAL 'phase' when
            // the component first renders. Use the getState method to get
            // access to store state in a NON-reactive way.
            const state = useGame.getState();

            let elapsedTime = 0;

            if (state.phase === "playing") {
                elapsedTime = Date.now() - state.startTime;
            } else if (state.phase === "ended") {
                elapsedTime = state.endTime - state.startTime;
            }

            elapsedTime /= 1000;
            elapsedTime = elapsedTime.toFixed(2);

            if (time.current) {
                time.current.textContent = elapsedTime;
            }
        });

        return unsubscribeEffect;
    }, []);

    return (
        <div className="interface">
            {/* Timer */}
            <div ref={time} className="time">
                0.00
            </div>

            {/* Restart button */}
            {phase === "ended" && (
                <div className="restart" onClick={restart}>
                    Restart
                </div>
            )}

            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? "active" : ""}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? "active" : ""}`}></div>
                    <div className={`key ${backward ? "active" : ""}`}></div>
                    <div className={`key ${rightward ? "active" : ""}`}></div>
                </div>
                <div className="raw">
                    <div className={`key large ${jump ? "active" : ""}`}></div>
                </div>
            </div>
        </div>
    );
}

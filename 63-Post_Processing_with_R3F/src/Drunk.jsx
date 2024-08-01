import { forwardRef } from "react";
import DrunkEffect from "./DrunkEffect";

export default forwardRef(function Drunk(props, ref) {
    const effect = new DrunkEffect();
    // console.log(effect);

    return <primitive ref={ref} object={effect} />;
});

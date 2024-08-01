import { Effect } from "postprocessing";

/**
 * WebGL2 syntax
 *
 * const: the parameter is not writable
 * in: it's a copy of the actual variable and changing it won't affect the initial variable sent
 * out: changing this value will change the variable sent when calling the function
 */
const fragmentShader = `
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        outputColor = vec4(uv, 1.0, 1.0);
    }
`;

export default class DrunkEffect extends Effect {
    constructor() {
        super("DrunkEffect", fragmentShader, {}); // Calls the constructor method of the parent class (Effect in this case)
    }
}

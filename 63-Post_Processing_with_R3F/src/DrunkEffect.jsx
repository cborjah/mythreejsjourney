import { Effect, BlendFunction } from "postprocessing";
import { Uniform } from "three";

/**
 * WebGL2 syntax
 *
 * const: the parameter is not writable
 * in: it's a copy of the actual variable and changing it won't affect the initial variable sent
 * out: changing this value will change the variable sent when calling the function
 */
const fragmentShader = `
    uniform float frequency;
    uniform float amplitude;

    void mainUv(inout vec2 uv) {
        uv.y += sin(uv.x * frequency) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    }
`;

export default class DrunkEffect extends Effect {
    constructor({
        frequency,
        amplitude,
        blendFunction = BlendFunction.DARKEN
    }) {
        super("DrunkEffect", fragmentShader, {
            blendFunction: blendFunction,
            uniforms: new Map([
                ["frequency", new Uniform(frequency)],
                ["amplitude", new Uniform(amplitude)]
            ])
        }); // Calls the constructor method of the parent class (Effect in this case)
    }
}

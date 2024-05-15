#define PI 3.14159

varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // Original
    // gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);

    // Pattern 1
    // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // Pattern 2
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // Pattern 3
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 4
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 5
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 6
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 7 (Shades pattern)
    // float strength = mod(vUv.y * 10.0, 1.0); // params (value to perform operation on, limit)
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 8 (Shades pattern)
    // float strength = mod(vUv.y * 10.0, 1.0); // params (value to perform operation on, limit)

    // Conditionals are bad for perfomance
    // if (strength > 0.5) {
    //     strength = 1.0;
    // } else {
    //     strength = 0.0;
    // }

    // Use step function instead
    // If the value is below the limit, step will return 0. Else, it will return 1.
    // strength = step(0.5, strength); // params (limit, value)

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength); // params (limit, value)

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength); // params (limit, value)

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 12 (Dots pattern)
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 13 (Dashed lines pattern)
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barY + barX;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 15 (Plus sign pattern)
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barY + barX;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 16
    // float strength = abs(vUv.x - 0.5);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 17
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 18
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 19
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 20
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 21
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 22 (Grid pattern)
    // float lines1 = floor(vUv.y * 10.0) / 10.0;
    // float lines2 = floor(vUv.x * 10.0) / 10.0;
    // float strength = lines1 * lines2;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 23 (Static pattern)
    // NOTE: There is no native random function in GLSL. The trick is to get a value so unpredictable that it looks random.
    // float strength = random(vUv);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 24 (Random Grid pattern)
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 25 (Slanted Random Grid pattern)
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0);
    // float strength = random(gridUv);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 26 (Burst pattern)
    // NOTE: Since you are using the length of the UV vector, it uses every direction, not just x and y but everything in between.
    // float strength = length(vUv);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 27 (Centered Burst pattern)
    // float strength = length(vUv - 0.5);
    // float strength = distance(vUv, vec2(0.5));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 28 (Inverse of pattern 27)
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 29 (Point Light pattern)
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 30 (Skewed Point Light pattern)
    /* vec2 lightUv = vec2(
        vUv.x * 0.1 + 0.45,
        vUv.y * 0.5 + 0.25
    ); */
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 31 (Star Point Light pattern)
    /* vec2 lightUvX = vec2(
        vUv.x * 0.1 + 0.45,
        vUv.y * 0.5 + 0.25
    );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    vec2 lightUvY = vec2(
        vUv.y * 0.1 + 0.45,
        vUv.x * 0.5 + 0.25
    );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    float strength = lightX * lightY;

    gl_FragColor = vec4(strength, strength, strength, 1.0); */

    // Pattern 32 (Rotated Star Point Light pattern)
    // NOTE: GLSL does not have access to PI.
    /* vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    vec2 lightUvX = vec2(
        rotatedUv.x * 0.1 + 0.45,
        rotatedUv.y * 0.5 + 0.25
    );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    vec2 lightUvY = vec2(
        rotatedUv.y * 0.1 + 0.45,
        rotatedUv.x * 0.5 + 0.25
    );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    float strength = lightX * lightY;

    gl_FragColor = vec4(strength, strength, strength, 1.0); */

    // Pattern 33 (Square w/ Centered Hole pattern)
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 34 (Square w/ Dim Target pattern)
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 35 (Square w/ Circle pattern)
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 36 (Opposite of pattern 35)
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 37 (Wavy Circle pattern)
    /* vec2 wavedUv = vec2(
        vUv.x,
        vUv.y + sin(vUv.x * 30.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(strength, strength, strength, 1.0); */

    // Pattern 38 (Splat Circle pattern)
    /* vec2 wavedUv = vec2(
        vUv.x + sin(vUv.y * 30.0) * 0.1,
        vUv.y + sin(vUv.x * 30.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(strength, strength, strength, 1.0); */

    // Pattern 39 (Grid Splat pattern)
    /* vec2 wavedUv = vec2(
        vUv.x + sin(vUv.y * 100.0) * 0.1,
        vUv.y + sin(vUv.x * 100.0) * 0.1
    );
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(strength, strength, strength, 1.0); */

    // Pattern 40 (Angle pattern)
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 41 (Half of Angle pattern)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 42 (Full Circle Angle pattern)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 43 (Full Circle Fan pattern)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 44 (Full Circle Fan pattern)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 200.0);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 45 (Wavy Circle pattern)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 200.0);

    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 46 (Perlin Noise pattern)
    // Perlin noise can be used to recreate nature shapes like clouds, water, fire, terrain elevation,
    // but it can also be used to animate the grass or snow moving in the wind.
    // There are many perlin noise algorithms with different results, different dimensions (2D, 3D, or even 4D),
    // some that repeat themselves, others more performant, etc.
    // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83/
    // float strength = cnoise(vUv * 10.0);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 47 (Perlin Noise pattern 2)
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 48 (Perline Noise pattern 3)
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 49 (Perline Noise pattern 4)
    // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 50 (Perline Noise pattern 5 with Mixed Colors)
    // Can switch out the strength variable to test color pattern with different designs.
    float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // Clamp the strength
    // NOTE: Use clamp for patterns like #11, #14, #15 to fix interpolation issues at intersections.
    // strength = clamp(strength, 0.0, 1.0);

    // Colored version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    // Black and White version
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

}

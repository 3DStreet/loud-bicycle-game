export function lerp(a, b, t) {
    t = Math.max(Math.min(t,1),0);
    return a + (b - a) * t;
}
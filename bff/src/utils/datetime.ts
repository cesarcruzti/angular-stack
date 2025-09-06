export function daysSinceEpoch():number {
    const millisecondsSinceEpoch = Date.now();
    const daysSinceEpoch = millisecondsSinceEpoch / (1000 * 60 * 60 * 24);
    return Math.floor(daysSinceEpoch);
}
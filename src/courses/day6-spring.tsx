export function Day6_GetSpringAPIParameters(numberOfGifts: number) {
    return {
        to: {
            position: [0, Math.floor(numberOfGifts % 2) === 0 ? 0 : 1, 0],
            rotation: [0, Math.floor(numberOfGifts % 2) === 0 ? 0 : 2 * Math.PI, 0]
        }
    };
}
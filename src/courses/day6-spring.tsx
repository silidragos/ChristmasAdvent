// Modify these values to correctly set up the Animation
const oddPosition = [0, 1, 0];
const evenPosition = [0, 0, 0];

const oddRotation = [0, 2 * Math.PI, 0];
const evenRotation = [0, 0, 0];

export const Day6_GetSpringAPIParameters: {
    position: {
        odd: number[],
        even: number[],
    },
    rotation: {
        odd: number[],
        even: number[],
    }
} = {
    position: {
        odd: oddPosition,
        even: evenPosition
    },
    rotation: {
        odd: oddRotation,
        even: evenRotation
    }
};

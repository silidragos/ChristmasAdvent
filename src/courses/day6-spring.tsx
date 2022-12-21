// Modify these values to correctly set up the Animation
const oddPosition: number[] = [0, 0, 0];
const evenPosition: number[] = [0, 1, 0];

const oddRotation: number[] = [5, 0, 0];
const evenRotation: number[] = [5, 0, 0];

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

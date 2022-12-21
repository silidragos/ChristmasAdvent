import { BoxProps, PublicApi } from "@react-three/cannon";

function PaletteMoveFunction(totalTime: number, speed: number) {
  return Math.sin(totalTime * speed);
}

export const Day5_DefineUseBox: BoxProps = {
  args: [2, 1.2, .5],
  position: [-3, 1.55, 1.5],
  rotation: [0, 0, 0],
  mass: 10,
  material: {
    friction: 0
  }
}

export function Day5_UseFrameHandlePosition(
  physicsAPI: PublicApi,
  initialPosition: Array<number>,
  totalTimePast: number,
  speedPerFrame: number
) {
  physicsAPI.position.set(
    initialPosition[0],
    initialPosition[1],
    initialPosition[2] + PaletteMoveFunction(totalTimePast, speedPerFrame)
  );
}

import { PublicApi, useBox } from "@react-three/cannon";
import { Group } from "three";

function PaletteMoveFunction(totalTime: number, speed: number) {
    return Math.sin(totalTime * speed);
}

export function Day5_DefineUseBox(){
    return useBox<Group>((idx) => ({
        args: [2, 1.2, .5], 
        position: [-3, 1.55, 1.5],
        rotation: [0, 0, 0],
        mass: 10,
        material: {
            friction: 0
        }
    }
    ));
}

export function Day5_UseFrameHandlePosition(physicsAPI: PublicApi, initialPosition: Array<number>, totalTimePast: number, speedPerFrame: number){
    physicsAPI.position.set(initialPosition[0], initialPosition[1], initialPosition[2] + PaletteMoveFunction(totalTimePast, speedPerFrame));
}
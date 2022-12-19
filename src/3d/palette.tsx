import { useBox } from "@react-three/cannon";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, PositionalAudio } from "three";
import * as THREE from 'three';
import { Materials, Nodes } from "../3d/3d.types";
import AudioComponent, { listener, TryPlaySound } from "../3d/audio-component";
import { Test4, SubscribeForTest5, Test5Passed } from "../services/TestingService";
import { off } from "process";
import { AUDIO_PUBLIC_URL } from "../services/Constants";
import { Day5_DefineUseBox, Day5_UseFrameHandlePosition } from "../courses/day5-physics";


function PaletteMoveFunction(totalTime: number, speed: number) {
    return Math.sin(totalTime * speed);
}

let initialPosition: Array<number>;
export default function RotativePalette({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    let paletteSound: PositionalAudio;

    const totalTime = useRef<number>(0);

    const deltaTimeInsideStep = useRef<number>(0);
    const hasPunched = useRef<boolean>(false);
    const speed = useMemo(() => { return 2.1; }, []);

    const [palette, physicsAPI] = Day5_DefineUseBox();

    useEffect(()=>{
        if(!physicsAPI) return;
        SubscribeForTest5(physicsAPI);
    },[physicsAPI]);

    useFrame((state, delta) => {
        if (palette.current === null) return;
        totalTime.current += delta;
        deltaTimeInsideStep.current += delta * speed;

        let offset = PaletteMoveFunction(totalTime.current, speed);

        if (initialPosition === undefined) {
            initialPosition = [palette.current.position.x, palette.current.position.y, palette.current.position.z];
        }

        if (deltaTimeInsideStep.current > Math.PI * 3.75 / 2 && !hasPunched.current) {
            TryPlaySound(paletteSound);
            hasPunched.current = true;
        }

        if (deltaTimeInsideStep.current > Math.PI * 2) {
            hasPunched.current = false;
            deltaTimeInsideStep.current = 0;
        }

        Day5_UseFrameHandlePosition(physicsAPI, initialPosition, totalTime.current, speed);
        physicsAPI.position.set(initialPosition[0], initialPosition[1], initialPosition[2] + PaletteMoveFunction(totalTime.current, speed));
    });

    return (
        <group>
            <group ref={palette}>
                <mesh>
                    <boxGeometry args={[2, 1.2, .5]} attach="geometry" />
                    <meshPhongMaterial attach="material" color="gray" specular={0xffffff} />
                </mesh>
            </group>
            <AudioComponent url={`${AUDIO_PUBLIC_URL}/punch.mp3`} volume={1} loop={false} autoplay={false} play={false} onInit={sound => {
                paletteSound = sound;
            }} />
        </group>
    );
}
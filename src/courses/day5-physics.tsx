import { useBox } from "@react-three/cannon";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, PositionalAudio } from "three";
import * as THREE from 'three';
import { Materials, Nodes } from "../3d/3d.types";
import AudioComponent, { listener, TryPlaySound } from "../3d/audio-component";
import { Test4, Test5, Test5Passed } from "../services/TestingService";
import { off } from "process";

/*
Concepts:
    - Physics - CannonJS
    - Physics Primitives
    - Material, friciton, mass, kinematic 
    - set position vs force, vs impulse
    - Parenting objects to Physics (position is weird)
    - React - useBox, useSphere etc.
Bonus:
    - Compound shapes
    - Spring physics, connections etc.
Tasks:
    - Attach a physics box to the palette and move it so that it hits objects inside the sack
Hints:
    - Mass: 0
    - Position.set
    - Math.Sin() is a great come and go function
 */


function PaletteMoveFunction(totalTime: number, speed: number) {
    return Math.sin(totalTime * speed);
}

const initialPosition = [-3, 1.55, 1.5];
export default function RotativePalette({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    let paletteSound: PositionalAudio;

    const totalTime = useRef<number>(0);

    const deltaTimeInsideStep = useRef<number>(0);
    const hasPunched = useRef<boolean>(false);
    const speed = useMemo(() => { return 2.1; }, []);

    //To Write
    const [palette, physicsAPI] = useBox<Group>((idx) => ({
        args: [2, 1.2, .5],
        position: [-2.5, 1.55, 1.2],
        rotation: [0, 0, 0],
        mass: 0,
        material: {
            friction: 0
        }
    }
    ));

    useFrame((state, delta) => {
        totalTime.current += delta;
        deltaTimeInsideStep.current += delta * speed;

        let offset = PaletteMoveFunction(totalTime.current, speed);
        Test5(totalTime.current, offset);

        if (Test5Passed()) {
            if (deltaTimeInsideStep.current > Math.PI * 3.75 / 2 && !hasPunched.current) {
                TryPlaySound(paletteSound);
                hasPunched.current = true;
            }

            if (deltaTimeInsideStep.current > Math.PI * 2) {
                hasPunched.current = false;
                deltaTimeInsideStep.current = 0;
            }
            //To Write?
            physicsAPI.position.set(initialPosition[0], initialPosition[1], initialPosition[2] + PaletteMoveFunction(totalTime.current, speed));
        }
    });

    return (
        <group>
            <group ref={palette}>
                <mesh>
                    <boxGeometry args={[2, 1.2, .5]} attach="geometry" />
                    <meshPhongMaterial attach="material" color="gray" specular={0xffffff} />
                </mesh>
            </group>
            <AudioComponent url={'./sfx/punch.mp3'} volume={1} loop={false} autoplay={false} play={false} onInit={sound => {
                paletteSound = sound;
            }} />
        </group>
    );
}
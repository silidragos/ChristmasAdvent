import { useBox } from "@react-three/cannon";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, PositionalAudio } from "three";
import * as THREE from 'three';
import { Materials, Nodes } from "../3d/3d.types";
import { listener } from "../3d/audio-component";

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

const initialPosition = [-3, 1.55, 1.5];
export default function RotativePalette({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const paletteSound = useRef<PositionalAudio>(null);
    const buffer = useLoader(THREE.AudioLoader, './sfx/punch.wav');

    const totalTime = useRef<number>(0);

    const deltaTimeInsideStep = useRef<number>(0);
    const hasPunched = useRef<boolean>(false);
    const speed = useMemo(() => { return 2.1; }, []);


    useEffect(() => {
        if (paletteSound.current === null || paletteSound.current === undefined) return;

        paletteSound.current.setBuffer(buffer);
        paletteSound.current.setLoop(false);
        paletteSound.current.setVolume(1);
    }, [paletteSound.current]);

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

        if (deltaTimeInsideStep.current > Math.PI * 3.75 / 2 && !hasPunched.current) {
            if (paletteSound.current !== null && paletteSound.current !== undefined) {

                if (paletteSound.current.isPlaying) {
                    paletteSound.current.stop();
                }
                paletteSound.current.play();
            }
            hasPunched.current = true;
        }

        if (deltaTimeInsideStep.current > Math.PI * 2) {
            hasPunched.current = false;
            deltaTimeInsideStep.current = 0;
        }


        //To Write?
        physicsAPI.position.set(initialPosition[0], initialPosition[1], initialPosition[2] + Math.sin(totalTime.current * speed) * 1);
    });

    return (
        <group>
            <group ref={palette}>
                <mesh>
                    <boxBufferGeometry args={[2, 1.2, .5]} attach="geometry" />
                    <meshPhongMaterial attach="material" color="gray" specular={0xffffff} />
                </mesh>
            </group>
            <positionalAudio ref={paletteSound} args={[listener]} />
        </group>
    );
}
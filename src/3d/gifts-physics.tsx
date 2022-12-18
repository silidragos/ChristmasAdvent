import { useBox, useCylinder } from "@react-three/cannon";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, InstancedMesh, Mesh, PositionalAudio } from "three";
import { factory } from "typescript";
import * as THREE from "three";

import Day4_Texturing from "../courses/day4-texturing";
import ElementFactory from "../services/ElementsFactory";
import AudioComponent, { listener, TryPlaySound } from "./audio-component";
import Day2_CustomShapes from "../courses/day2-custom-shapes";
import { Test4, Test4Passed } from "../services/TestingService";
import { AUDIO_PUBLIC_URL } from "../services/Constants";


function GiftPhysics({ delay, lifetime, children, onSpawn }: { delay: number, lifetime: number, children: React.ReactNode, onSpawn: any }) {
    const mesh = useRef<Group>(null);

    const [gift, physicsAPI] = useBox<Group>((idx) => ({
        args: [.4, .4, .4],
        position: [0, 10, 2],
        rotation: [0, 0, 0],
        mass: 1,
        material: {
            friction: 0
        }
    }
    ));

    useEffect(() => {
        if (mesh.current === undefined) return;

        physicsAPI.mass.set(0);
        physicsAPI.sleep();
        setTimeout(() => {
            if (mesh.current !== null) {
                mesh.current.visible = true;

                physicsAPI.wakeUp();
                physicsAPI.position.set(0, 1.25, 2);
                physicsAPI.mass.set(1);
                physicsAPI.velocity.set(-1, 0, 0);
                onSpawn();

                setInterval(() => {
                    physicsAPI.position.set(0, 1.25, 2);
                    physicsAPI.mass.set(1);
                    physicsAPI.velocity.set(-1, 0, 0);
                    onSpawn();
                }, lifetime)
            }
        }, delay);

    }, [mesh.current])

    useFrame(() => {
    })
    return (
        <group ref={gift}>
            <group ref={mesh} visible={false}>
                {children}
            </group>
        </group>
    )
}

export default function GiftsPhysics() {
    let giftsSound: PositionalAudio;

    const [floorCollider,] = useBox<InstancedMesh>((idx) => ({
        args: [12, .2, 12],
        position: [-2, 0, 3],
        rotation: [0, 0, 0],
        mass: 0
    }
    ));
    const [bandCollider,] = useBox<InstancedMesh>((idx) => ({
        args: [3, .75, .7],
        position: [-0.65, .6, 2.1],
        rotation: [0, 0, 0],
        mass: 0,
        material: {
            friction: 0
        }
    }
    ));

    const [tableCollider,] = useCylinder<InstancedMesh>((idx) => (
        {
            args: [.65, .65, .85, 8],
            position: [-2.85, .3, 2],
            mass: 0
        }
    ));


    let texFactory: ElementFactory = useMemo(() => {
        return new ElementFactory(Day4_Texturing);
    }, []);

    let giftFactory: ElementFactory = useMemo(() => {
        if (texFactory.elements === undefined || texFactory.elements.length === 0) return new ElementFactory([]);

        let elements = Day2_CustomShapes;

        let meshes = [];

        Test4(texFactory.getAll());

        let texs = texFactory.getAll();
        if (Test4Passed()) {
            for (let i = 0; i < elements.length; i++) {
                meshes.push(
                    <mesh>
                        {elements[i].props.children}
                        {texs[Math.floor(Math.random() * texs.length)]}
                    </mesh>
                )
            }
        }

        return new ElementFactory(meshes);
    }, []);

    const getGifts = function () {
        let gifts = [];
        const giftNumber = 5;
        for (let i = 0; i < giftNumber; i++) {
            gifts.push(
                <GiftPhysics key={i} delay={3000 * i} lifetime={3000 * giftNumber} onSpawn={() => {
                    TryPlaySound(giftsSound);
                }}>
                    {giftFactory.getRandom()}
                </GiftPhysics>
            )
        }
        return gifts;
    }

    return (
        <group>
            {getGifts()}
            <AudioComponent url={`${AUDIO_PUBLIC_URL}/spray.mp3`} volume={1} loop={false} autoplay={false} play={false} onInit={sound => {
                giftsSound = sound;
            }} />
        </group>
    );
}
import { useEffect, useMemo, useRef } from "react";
import { Vector3, BufferGeometry, PositionalAudio } from "three";
import * as THREE from "three";

import GiftFactory from "../services/ElementsFactory";
import Curve from "./curve";

import Day2CustomShapes from "../courses/day2-custom-shapes";
import Gift from "../courses/day3-useFrame";
import { Line } from "@react-three/drei";
import { extend, ReactThreeFiber, useLoader } from "@react-three/fiber";
import { listener } from "./audio-component";

const giftSpeed = 0.05;


extend({ Line_: THREE.Line })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
        }
    }
}

export default function Gifts() {
    const giftsSound = useRef<PositionalAudio>(null);
    const buffer = useLoader(THREE.AudioLoader, './sfx/boop.wav');

    let [myLineGeometry, curve] = useMemo(() => {
        let points = [
            new Vector3(0, 0, 0),
            new Vector3(-0.8, 0, -.05),
            new Vector3(-1.1, 0, -.25),
            new Vector3(-1.3, 0, -.7),
            new Vector3(-1.1, 0, -1.3),
            new Vector3(-0.4, 0, -1.8),
            new Vector3(0.5, 0, -2.1),
            new Vector3(1.4, 0, -2.1),
            new Vector3(2.5, 0, -2.1),
            new Vector3(3.5, 0, -1.6),
            new Vector3(4.1, 0, -1.0),
            new Vector3(4.2, 0, -.75),
            new Vector3(4.3, 0, 0.5),
            new Vector3(4.0, 0, 1.3),
            new Vector3(3.5, 0, 1.7),
            new Vector3(2.5, 0, 1.85),
            new Vector3(1.5, 0, 2)];

        const lineGeometry = new BufferGeometry().setFromPoints(points);
        return [lineGeometry, new Curve(points)];
    }, []);


    useEffect(() => {
        if(giftsSound.current === null || giftsSound.current === undefined) return;

        giftsSound.current.setBuffer(buffer);
        giftsSound.current.setLoop(false);
        giftsSound.current.setVolume(1);
    }, [giftsSound.current]);

    let giftFactory: GiftFactory = useMemo(() => {
        return new GiftFactory(Day2CustomShapes());
    }, []);

    const getGifts = function () {
        let gifts: any[] = [];
        let count = 10;
        for (let i = 0; i < count; i++) {
            gifts.push(
                <Gift key={i} curve={curve} offset={i * (1.0 / count)} giftSpeed={giftSpeed} onRespawn={() => {
                    if(giftsSound.current === null || giftsSound.current === undefined){
                        return;
                    }

                    if(giftsSound.current.isPlaying){
                        giftsSound.current.stop();
                    }
                    giftsSound.current.play();
                }}>
                    {giftFactory.getRandom()}
                </Gift >
            );
        }
        return gifts;
    }
    return (
        <>
            <group position={[-1.5, 1, 0]}>
                <line_ geometry={myLineGeometry}>
                    <lineBasicMaterial attach="material" color="red"></lineBasicMaterial>
                </line_>
                {getGifts()}


                <positionalAudio ref={giftsSound} args={[listener]} />
            </group>
        </>
    );
}
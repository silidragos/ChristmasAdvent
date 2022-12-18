import { useEffect, useMemo, useRef } from "react";
import { Vector3, BufferGeometry, PositionalAudio } from "three";
import * as THREE from "three";

import GiftFactory from "../services/ElementsFactory";
import Curve from "./curve";

import Day2_CustomShapes from "../courses/day2-custom-shapes";
import Gift from "../courses/day3-useFrame";
import { Line } from "@react-three/drei";
import { extend, ReactThreeFiber, useLoader } from "@react-three/fiber";
import AudioComponent, { listener, TryPlaySound } from "./audio-component";
import { Test1Passed, Test2, Test2Passed } from "../services/TestingService";
import { AUDIO_PUBLIC_URL, WINDOW_EVENTS } from "../services/Constants";
import { useWindowEvent, WindowMessage, emitWindowEvent } from "../services/WindowEvents";

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
    let giftsSound: PositionalAudio;

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

    let giftFactory: GiftFactory = useMemo(() => {
        return new GiftFactory(Day2_CustomShapes);
    }, []);

    const getGifts = function () {
        let gifts: any[] = [];
        let count = 10;
        Test2(giftFactory.getAll());

        if (Test2Passed()) {
            for (let i = 0; i < count; i++) {
                gifts.push(
                    <Gift key={i} curve={curve} offset={i * (1.0 / count)} giftSpeed={giftSpeed} onRespawn={() => {
                        TryPlaySound(giftsSound);
                    }}>
                        {giftFactory.getRandom()}
                    </Gift >
                );
            }
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

                <AudioComponent url={`${AUDIO_PUBLIC_URL}/boop.mp3`} volume={1} loop={false} autoplay={false} play={false} onInit={sound => {
                    giftsSound = sound;
                }} />
            </group>
            <Test1Component />
            <Test2Component giftFactory={giftFactory} />
        </>
    );
}

const Test1Component = () => {
    const onMessage = (message: WindowMessage) => {
        const didTest1Pass = Test1Passed();
        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_1_RESULT,
            payload: {
                status: didTest1Pass,
                reason: 'Test failed. Reason TBD'
            }
        });
    }

    useWindowEvent(WINDOW_EVENTS.TEST_1_RUN, onMessage);
    return null;
}

const Test2Component = ({ giftFactory }: { giftFactory: GiftFactory }) => {
    const onMessage = (message: WindowMessage) => {
        const didTest2Pass = Test2Passed();
        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_2_RESULT,
            payload: {
                status: didTest2Pass,
                reason: 'Test failed. Reason TBD'
            }
        });
     
        console.log(didTest2Pass);
    }

    useWindowEvent(WINDOW_EVENTS.TEST_2_RUN, onMessage);
    return null;
}

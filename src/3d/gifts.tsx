import * as THREE from "three";
import { useMemo } from "react";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { Vector3, BufferGeometry, PositionalAudio } from "three";

import Curve from "./curve";
import GiftFactory from "../services/ElementsFactory";
import { AUDIO_PUBLIC_URL } from "../services/Constants";
import { Day3_Gift } from "../courses/day3-useFrame";
import Day2_CustomShapes from "../courses/day2-custom-shapes";
import AudioComponent, { TryPlaySound } from "./audio-component";
import {
  Test2,
  Test2Component,
  Test2Passed,
  Test4Component,
} from "../services/TestingService";

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
    const test2Result = Test2(giftFactory.getAll());

    if (test2Result.valid) {
      for (let i = 0; i < count; i++) {
        gifts.push(
          <Day3_Gift key={i} curve={curve} initialOffset={i * (1.0 / count)} giftSpeedPerSecond={giftSpeed} onRespawnCallback={() => {
            TryPlaySound(giftsSound);
          }}>
            {giftFactory.getRandom()}
          </Day3_Gift >
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
      <Test2Component giftFactory={giftFactory} />
    </>
  );
}

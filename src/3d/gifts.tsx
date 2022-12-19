import * as THREE from "three";
import { PropsWithChildren, useMemo, useRef } from "react";
import { Vector3, BufferGeometry, PositionalAudio } from "three";
import { extend, ReactThreeFiber, useFrame } from "@react-three/fiber";

import Curve from "./Curve";
import { Day3_Gift } from "../courses/day3-useFrame";
import GiftFactory from "../services/ElementsFactory";
import { AUDIO_PUBLIC_URL } from "../services/Constants";
import Day2_CustomShapes from "../courses/day2-custom-shapes";
import AudioComponent, { TryPlaySound } from "./audio-component";
import {
  Test2,
  Test2Component,
  Test3,
  Test3Component,
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


export function Day3_CalculateNewPosition(curve: Curve, newOffset: number, onRespawnCallback: ()=>void): THREE.Vector3{
  if(newOffset <= .1){
      onRespawnCallback();
  }
  let newPosOnCurve = curve.Sample(newOffset);

  return newPosOnCurve;
}

function Day3_Tester({
  idx,
  curve,
  initialOffset,
  giftSpeedPerSecond,
  children,
  giftPosReferences
}: PropsWithChildren<{
  idx:number,
  curve: Curve,
  initialOffset: number,
  giftSpeedPerSecond: number,
  giftPosReferences: any[]
}>){

  useFrame(()=>{
    if (giftPosReferences[idx] === undefined) {
      return;
    }

    let isCorrect = Test3({idx, curve, initialOffset, giftSpeedPerSecond, positions: giftPosReferences.map(g => g.position) });

    if(!isCorrect.valid){
      giftPosReferences[idx].children[0].material.color.setHex("0xff0000");
    }else{
      giftPosReferences[idx].children[0].material.color.setHex("0xffffff");
    }
  })

  return (
    <> {children} </>
  );
}

export default function Gifts() {
  let giftPositionReferences = useRef<THREE.Group[]>([]);
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
    giftPositionReferences.current = [];

    if (test2Result.valid) {
      for (let i = 0; i < count; i++) {
        gifts.push(
          <Day3_Tester key={i} idx={i} curve={curve} initialOffset={i * (1.0 / count)} giftSpeedPerSecond={giftSpeed} giftPosReferences = {giftPositionReferences.current}>
            <Day3_Gift key={i} curve={curve} initialOffset={i * (1.0 / count)} giftSpeedPerSecond={giftSpeed} onRespawnCallback={() => {
              TryPlaySound(giftsSound);
            }}
            onInit = {(posRef: THREE.Group)=>{
              giftPositionReferences.current.push(posRef);
            }}>
              {giftFactory.getRandom()}
            </Day3_Gift >
          </Day3_Tester>
        );
      }

      gifts.push(
        <Test3Component
          key="test3Component"
          giftCount={10}
          curve={curve}
          giftSpeedPerSecond={giftSpeed}
          getPositions={() => giftPositionReferences.current.map(g => g.position)}
        />
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

        <AudioComponent url={`${AUDIO_PUBLIC_URL}/boop.mp3`} volume={1} loop={false} autoplay={false} play={false} onInit={sound => {
          giftsSound = sound;
        }} />
      </group>
      <Test2Component giftFactory={giftFactory} />
    </>
  );
}

import { useBox } from "@react-three/cannon";
import { useSpring, config, animated } from '@react-spring/three';
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, PositionalAudio } from "three";
import * as THREE from 'three';
import { extend, ReactThreeFiber, useLoader } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Materials, Nodes } from "../3d/3d.types";

import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import AudioComponent, { listener, TryPlaySound } from "../3d/audio-component";
import { AUDIO_PUBLIC_URL, PUBLIC_URL } from "../services/Constants";
import { Day6_GetSpringAPIParameters } from "../courses/day6-spring";
import { Test6, Test6Passed } from "../services/TestingService";

extend({ TextGeometry });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            textGeometry: ReactThreeFiber.Object3DNode<TextGeometry, typeof TextGeometry>
        }
    }
}

export default function DestinationBox({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const [didLoadFont, setDidLoadFont] = useState(false);
    const fontRef = useRef<Font | null>(null);

    let magicSound: PositionalAudio;

    useEffect(() => {
        loadFont();
    }, []);

    const loadFont = async () => {
        const resp = await fetch(`${PUBLIC_URL}/fonts/Mountains_of_Christmas_Bold.json`);
        const fontJson = await resp.json();

        fontRef.current = new FontLoader().parse(fontJson);
        setDidLoadFont(true);
    }


    let numberOfGifts = useRef(0);

    const [boxCollider,] = useBox<Group>((idx) => ({
        args: [2.5, 2, 2],
        position: [-3.1, 1, 4.5],
        rotation: [0, 0, 0],
        mass: 0,
        isTrigger: true,
        onCollideBegin: (evt) => {
            TryPlaySound(magicSound);
            numberOfGifts.current++;
            let springParams = Day6_GetSpringAPIParameters(numberOfGifts.current);
            Test6(springParams, numberOfGifts.current);

            if (Test6Passed()) {
                springAPI.start(springParams);
            }
        }
    }
    ));

    const [styles, springAPI] = useSpring(() => (
        {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            config: config.slow,
        }
    ));

    return (
        <group>
            <mesh geometry={nodes.EndBucket.geometry} material={materials.Red} position={[-3.64, 0.64, 3.83]} rotation={[-Math.PI / 2, 0, 0]} scale={0.44} />

            <group position={[-2.5, 2, 4.76]} rotation={[0, 0, 0]}>
                {/* @ts-ignore */}
                <animated.group position={styles.position} rotation={styles.rotation}>
                    <mesh position={[1, 0, 0]} rotation={[0, Math.PI, 0]}>
                        {(didLoadFont && fontRef.current) && (
                            <textGeometry args={["Good Children", { font: fontRef.current, size: .5, height: .2 }]}></textGeometry>
                        )}
                        <meshLambertMaterial color="green"></meshLambertMaterial>
                    </mesh>
                </animated.group>
            </group>
            <AudioComponent url={`${AUDIO_PUBLIC_URL}/magic.mp3`} volume={1} loop={false} autoplay={false} play={false} onInit={sound => {
                magicSound = sound;
            }} />
        </group>
    );


}
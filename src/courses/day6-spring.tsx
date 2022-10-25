import { useBox } from "@react-three/cannon";
import { useSpring, config, animated } from '@react-spring/three';
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Materials, Nodes } from "../3d/3d.types";

import myFont from '../fonts/Mountains of Christmas_Bold.json';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

extend({ TextGeometry });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            textGeometry: ReactThreeFiber.Object3DNode<TextGeometry, typeof TextGeometry>
        }
    }
}

export default function DestinationBox({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const font = new FontLoader().parse(myFont);
    let numberOfGifts = useRef(0);

    const [boxCollider,] = useBox<Group>((idx) => ({
        args: [2.5, 2, 2],
        position: [-3.1, 1, 4.5],
        rotation: [0, 0, 0],
        mass: 0,
        isTrigger: true,
        onCollide: (evt) => {
            numberOfGifts.current++;
            //To Write
            // springAPI.start({
            //     to: {
            //         position: [0, Math.floor(numberOfGifts.current % 2) === 0 ? 0 : 1, 0],
            //         rotation: [0, Math.floor(numberOfGifts.current % 2) === 0 ? 0 : 2 * Math.PI, 0]
            //     }
            // })
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
                        <textGeometry args={["Good Children", { font: font, size: .5, height: .2 }]}></textGeometry>
                        <meshLambertMaterial color="green"></meshLambertMaterial>
                    </mesh>
                </animated.group>
                {/* <animated.mesh position={styles.position} rotation={styles.rotation} geometry={nodes.DestinationText.geometry} material={materials.Green} scale={0.55} /> */}
            </group>
        </group>
    );


}
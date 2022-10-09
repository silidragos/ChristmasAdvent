import { useBox } from "@react-three/cannon";
import { useSpring, config, animated } from '@react-spring/three';
import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { Materials, Nodes } from "./3d.types";

export default function DestinationBox({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
    const numberOfGifts = useRef(0);
    const [boxCollider,] = useBox<Group>((idx) => ({
        args: [2.5, 2, 2],
        position: [-3.1, 1, 4.5],
        rotation: [0, 0, 0],
        mass: 0,
        isTrigger: true,
        onCollide: (evt) => {
            numberOfGifts.current++;
            springAPI.start({
                to: {
                    position: [0, 0, Math.floor(numberOfGifts.current % 2) === 0 ? 0 : -1],
                    rotation: [0, 0, Math.floor(numberOfGifts.current % 2) === 0 ? Math.PI : 3 * Math.PI]
                }
            }
            )
        }
    }
    ));

    const [styles, springAPI] = useSpring(() => (
        {
            position: [0, 0, 0],
            rotation: [0, 0, Math.PI],
            config: config.slow,
        }
    ));
    return (
        <group>
            <group position={[-3.64, 0.64, 3.83]} rotation={[-Math.PI / 2, 0, 0]} scale={0.44}>
                <mesh geometry={nodes.Cube002.geometry} material={materials.Red} />
                <mesh geometry={nodes.Cube002_1.geometry} material={materials.Green} />
            </group>
            <group position={[-2.98, 1.89, 4.76]} rotation={[Math.PI / 2, 0, 0]}>
                {/* @ts-ignore */}
                <animated.mesh position={styles.position} rotation={styles.rotation} geometry={nodes.DestinationText.geometry} material={materials.Green} scale={0.55} />
            </group>
        </group>
    );


}
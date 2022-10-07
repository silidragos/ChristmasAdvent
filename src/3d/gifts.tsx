import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3, Group } from "three";
import GiftFactory from "../services/ElementsFactory";
import Curve from "./curve";

const giftSpeed = 0.05;

function Gift({ curve, offset, children }: { curve: Curve, offset: number, children: React.ReactNode }) {
    let cube = useRef<Group>(null);
    let position = useRef<any>(offset);

    useFrame((state, delta) => {
        if (cube.current === undefined || position.current === undefined) return;

        position.current = (position.current + delta * giftSpeed) % 1;
        let pos = curve.Sample(position.current);
        cube.current?.position.set(pos.x, pos.y, pos.z);
    })

    return (
        <group ref={cube} position={[0, 0, 0]}>
            {children}
        </group>
    )
}

export default function Gifts() {
    let curve: Curve = useMemo(() => {
        return new Curve([
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
            new Vector3(1.5, 0, 2)
        ]
        )
    }, []);

    let giftFactory: GiftFactory = useMemo(() => {
        return new GiftFactory([
            <mesh>
                <boxBufferGeometry args={[0.4, 0.4, 0.4]} attach="geometry" />
                <meshPhongMaterial attach="material" />
            </mesh>,
            <mesh>
                <sphereBufferGeometry args={[0.2, 8, 8]} attach="geometry" />
                <meshPhongMaterial attach="material" />
            </mesh>,
            <mesh>
                <torusKnotBufferGeometry args={[0.1, 0.05, 24, 6]} attach="geometry" />
                <meshPhongMaterial attach="material" />
            </mesh>,
        ]);
    }, []);

    const getGifts = function () {
        let gifts: any[] = [];
        let count = 10;
        for (let i = 0; i < count; i++) {
            gifts.push(
            <Gift key={i} curve={curve} offset={i * (1.0 / count)}>
                {giftFactory.getRandom()}    
            </Gift>
                );
        }
        return gifts;
    }
    return (
        <group position={[-1.5, 1, 0]}>
            {getGifts()}
        </group>
    );
}
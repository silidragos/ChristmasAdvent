import { useFrame } from "@react-three/fiber";
import { off } from "process";
import { useMemo, useRef } from "react";
import { Vector3, Mesh } from "three";
import Curve from "./curve";

const giftSpeed = 0.05;

function Gift({curve, offset} : {curve : Curve, offset: number}) {
    let cube = useRef<Mesh>(null);
    let position = useRef<any>(offset);
    
    useFrame((state, delta) => {
        if (cube.current === undefined || position.current === undefined) return;

        position.current = (position.current + delta * giftSpeed) % 1;
        let pos = curve.Sample(position.current);
        cube.current?.position.set(pos.x, pos.y, pos.z);
    })

    return (
        <mesh ref={cube} position={[0, 0, 0]}>
            <boxBufferGeometry args={[0.4, 0.4, 0.4]} attach="geometry" />
            <meshPhongMaterial attach="material" />
        </mesh>
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
            new Vector3(4.3, 0, 0.5),
            new Vector3(4.0, 0, 1.3),
            new Vector3(3.5, 0, 1.7),
            new Vector3(1.5, 0, 2)
        ]
        )
    }, []);

    const getGifts = function(){
        let gifts : any[] = [];
        let count = 10;
        for(let i=0; i<count; i++){
            gifts.push(<Gift key={i} curve={curve} offset={i * (1.0 / count)}/>)
        }
        return gifts;
    }
    return (
        <group position={[-1.5, 1, 0]}>
            {getGifts()}
        </group>
    );
}
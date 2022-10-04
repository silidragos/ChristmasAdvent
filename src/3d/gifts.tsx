import { useMemo } from "react";
import {Vector3} from "three";
import Curve from "./curve";

export default function Gifts() {
    let curve : Curve = useMemo(()=>{
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

    let getGifts = function () {
        let gifts = [];
        let count = 100;
        for (let i = 0; i < count; i++) {
            let pos = curve.Sample(i * 1.0 / count);
            gifts.push(
                <mesh position={[pos.x, pos.y, pos.z]}>
                    <boxBufferGeometry args={[0.1, 0.1, 0.1]} attach="geometry" />
                    <meshPhongMaterial attach="material" />
                </mesh>
            );
        }
        return gifts;
    }
    return (
        <group position = {[-1.5, 1, 0]}>
            {getGifts()}
        </group>
    );
}
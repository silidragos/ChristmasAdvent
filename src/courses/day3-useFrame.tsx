import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import Curve from "../3d/curve";

export default function Day3_useFrame({ curve, offset, giftSpeed, children }: { curve: Curve, offset: number, giftSpeed: number, children: React.ReactNode }) {
    let cube = useRef<Group>(null);
    let position = useRef<any>(offset);

    useFrame((state, delta) => {
        if (cube.current === null || position.current === null) return;

        //To write
        // position.current = (position.current + delta * giftSpeed) % 1;
        
        
        let pos = curve.Sample(position.current);
        cube.current.position.set(pos.x, pos.y, pos.z);
    })

    return (
        <group ref={cube} position={[0, 0, 0]}>
            {children}
        </group>
    )
}
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import Curve from "../3d/curve";

/*
Concepts:
    - React-three-fiber gives us access to a bunch of hooks
    - e.g. UseThree -> camera, scene etc
    - useFrame is running once every frame. But be careful, if you have a fast pc it might run 100 times per second, while if you have a slow one, 10fps. Do not bet on the frequency of it
    - You can set attributes, programatically as well, using references (e.g. cube.current.position = ...)
    - delta is the time between last 2 frames
    - curve.Sample(x), x from 0 to 1.
    - we provide you with a simple, curve sampling algorithm. It's represented by the red curve you can see in-scene. You can read the method if curious
    - you can sample any point on it, by grabbing any percentage from 0 to 1
Bonus:
    - about curve renderer
    - about clock
Tasks:
    - Given the start offset and the giftSpeed (per second), update each frame, the gift's position
    - Once a gift gets to 1 (finish the curve), allow it to start again. Thus we reuse the mesh, and we keep our performance good.
 */

export default function Day3_useFrame({ curve, offset, giftSpeed, children, onRespawn}: { curve: Curve, offset: number, giftSpeed: number, children: React.ReactNode, onRespawn: any }) {
    let parent = useRef<Group>(null);
    let totalOffset = useRef<any>(offset);

    useFrame((state, delta) => {
        if (parent.current === null || totalOffset.current === null) return;

        //To write
        totalOffset.current = (totalOffset.current + delta * giftSpeed) % 1;
        if(totalOffset.current <= delta*giftSpeed){
            onRespawn();
        }
        let pos = curve.Sample(totalOffset.current);
        parent.current.position.set(pos.x, pos.y, pos.z);
    })

    return (
        <group ref={parent} position={[0, 0, 0]}>
            {children}
        </group>
    )
}
import { useFrame, Vector3 } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Group } from "three";
import Curve from "../3d/curve";

let lastPosOnCurve = 0;
function CalculateNewPosition(curve: Curve, newOffset: number, onRespawnCallback: ()=>void): THREE.Vector3{
        if(newOffset <= lastPosOnCurve){
            onRespawnCallback();
        }
        lastPosOnCurve = newOffset;
        let newPosOnCurve = curve.Sample(newOffset);

        return newPosOnCurve;
}

// For each gift we give: offset along the curve last frame, curve position sampler, and gift speed per second
// Calculate new position  
function Day3_Gift({ curve, initialOffset, giftSpeedPerSecond, children, onRespawnCallback}: { curve: Curve, initialOffset: number, giftSpeedPerSecond: number, children: React.ReactNode, onRespawnCallback: any }) {
    let parent = useRef<Group>(null);

    useFrame((state, deltaTime) => {
        if (parent.current === null) return;

        let newOffset = (initialOffset + Date.now()/1000.0 * giftSpeedPerSecond) % 1;

        //given
        let calculatedPosition:THREE.Vector3 = CalculateNewPosition(curve, newOffset, onRespawnCallback);
        
        //set "pos" to parent.current
        parent.current.position.set(calculatedPosition.x,calculatedPosition.y, calculatedPosition.z)
    })

    return (
        <group ref={parent} position={[0, 0, 0]}>
            {children}
        </group>
    )
}

export { Day3_Gift };

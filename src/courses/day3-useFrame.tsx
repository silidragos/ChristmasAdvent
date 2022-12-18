import { useFrame, Vector3 } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Group } from "three";
import Curve from "../3d/curve";

function CalculateNewPosition(curve: Curve, totalOffset: MutableRefObject<any>, speedSinceLastFrame: number, onRespawnCallback: ()=>void): THREE.Vector3{
        totalOffset.current = (totalOffset.current + speedSinceLastFrame) % 1;
        if(totalOffset.current <= speedSinceLastFrame){
            onRespawnCallback();
        }
        let newPosOnCurve = curve.Sample(totalOffset.current);

        return newPosOnCurve;
}

// For each gift we give: offset along the curve last frame, curve position sampler, and gift speed per second
// Calculate new position  
function Day3_Gift({ curve, offset, giftSpeed, children, onRespawnCallback}: { curve: Curve, offset: number, giftSpeed: number, children: React.ReactNode, onRespawnCallback: any }) {
    let parent = useRef<Group>(null);
    let currentOffsetAlongCurve = useRef<any>(offset);

    useFrame((state, deltaTime) => {
        if (parent.current === null || currentOffsetAlongCurve.current === null) return;

        //To write
        let offsetAlongCurveSinceLastFrame = giftSpeed * deltaTime;

        //given
        let calculatedPosition:THREE.Vector3 = CalculateNewPosition(curve, currentOffsetAlongCurve, offsetAlongCurveSinceLastFrame, onRespawnCallback);
        
        //set "pos" to parent.current
    })

    return (
        <group ref={parent} position={[0, 0, 0]}>
            {children}
        </group>
    )
}

export { Day3_Gift };

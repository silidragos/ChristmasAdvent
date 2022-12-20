import { useFrame, Vector3 } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef } from "react";
import { Group } from "three";
import Curve from "../3d/Curve";
import { Day3_CalculateNewPosition } from "../3d/gifts";


// For each gift we give: offset along the curve last frame, curve position sampler, and gift speed per second
// Calculate new position  
function Day3_Gift({ curve, initialOffset, giftSpeedPerSecond, children, onRespawnCallback, onInit}: { curve: Curve, initialOffset: number, giftSpeedPerSecond: number, children: React.ReactNode, onRespawnCallback: any, onInit: any }) {
    let parent = useRef<Group>(null);

    useEffect(()=>{
        if(parent.current !== null){
            onInit(parent.current);
        }
    }, [parent.current])

    useFrame((state, deltaTime) => {
        if (parent.current === null) return;

        let newOffset = (initialOffset + Date.now()/1000.0 * giftSpeedPerSecond) % 1;

        //given
        let calculatedPosition:THREE.Vector3 = Day3_CalculateNewPosition(curve, newOffset, onRespawnCallback);
        
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

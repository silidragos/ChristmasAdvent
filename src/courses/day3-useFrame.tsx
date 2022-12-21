import { PropsWithChildren, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import Curve from "../3d/Curve";
import { Day3_CalculateNewPosition } from "../3d/gifts";

// For each gift we give: offset along the curve last frame, curve position sampler, and gift speed per second
// Calculate new position  
interface Props {
  curve: Curve;
  initialOffset: number;
  giftSpeedPerSecond: number;
  onRespawnCallback: () => void;
  onInit: (group: Group) => void;
}
function Day3_Gift({
  onInit,
  curve,
  children,
  initialOffset,
  giftSpeedPerSecond,
  onRespawnCallback,
}: PropsWithChildren<Props>) {
  let parent = useRef<Group>(null);

  useEffect(() => {
    if (parent.current !== null) {
      onInit(parent.current);
    }
  }, [onInit])

  useFrame(() => {
    if (parent.current === null) {
      return
    };

    // Calculeaza noul offset in functie de timp
    let newOffset = initialOffset + 0;

    let calculatedPosition: THREE.Vector3 = Day3_CalculateNewPosition(curve, newOffset, onRespawnCallback);
    parent.current.position.set(calculatedPosition.x, calculatedPosition.y, calculatedPosition.z);
  })

  return (
    <group ref={parent} position={[0, 0, 0]}>
      {children}
    </group>
  )
}

export { Day3_Gift };

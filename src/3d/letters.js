import { Debug, useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useLayoutEffect, useState } from "react";

export function Letter({ count, interval }) {
    const currentTime = useRef(0);
    const currentIdx = useRef(-1);

    const collisionGroup1 = useRef(1);
    const collisionGroup2 = useRef(2);
    const [letterCollider, letterAPI] = useBox((idx) => ({
        args: [.4, 0.02, .7],
        position: [-.5, 2.25, 0],
        rotation: [0, 0, 0],
        mass: 1
    }
    ));

    useLayoutEffect(() => {
        // for(let i=0; i<count; i++){
        //     letterAPI.at(i).
        // }
    }, []);

    useEffect(()=>{
        for (let i = 0; i < count; i++) {
            if (i != currentIdx.current) {
                letterAPI.at(i).angularDamping = 0.1;
            }
        }
    },[])

    useFrame((state, deltaTime) => {
        currentTime.current += deltaTime
        if (currentTime.current > interval) {
            currentTime.current = 0;
            currentIdx.current = (currentIdx.current + 1) % count;

            const api = letterAPI.at(currentIdx.current);

            api.wakeUp();
            api.mass.set(1);
            api.collisionFilterGroup.set(collisionGroup2.current);
            api.collisionFilterMask.set(0);
            api.applyLocalForce([85, 4, 0], [0, 0, 0]);
        }

        for (let i = 0; i < count; i++) {
            if (i != currentIdx.current) {
                letterAPI.at(i).sleep();
                letterAPI.at(i).position.set(-.5, 2.25 + i/10, 0);
                letterAPI.at(i).mass.set(0);
                letterAPI.at(i).collisionFilterGroup.set(collisionGroup1.current);
                letterAPI.at(i).collisionFilterMask.set(collisionGroup1.current);
            }
        }
    });

    return (
        <instancedMesh ref={letterCollider} args={[null, null, count]}>
            <boxBufferGeometry args={[.4, 0.02, .7]} />
            <meshBasicMaterial color="pink"></meshBasicMaterial>
        </instancedMesh>
    )
}

export function Letters() {
    return (
        <group>
            <Letter count={2} interval={1} />
        </group>
    )
}
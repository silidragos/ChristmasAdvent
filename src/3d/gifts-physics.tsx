import { useBox, useCylinder } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, InstancedMesh, Mesh } from "three";


function GiftPhysics({ delay, lifetime }: { delay: number, lifetime: number }) {
    const mesh = useRef<Mesh>(null);

    const [gift, physicsAPI] = useBox<Group>((idx) => ({
        args: [.4, .4, .4],
        position: [0, 10, 2],
        rotation: [0, 0, 0],
        mass: 1,
        material: {
            friction: 0
        }
    }
    ));

    useEffect(() => {
        if (mesh.current === undefined) return;

        physicsAPI.mass.set(0);
        physicsAPI.sleep();
        setTimeout(() => {
            if (mesh.current !== null) {
                mesh.current.visible = true;
                physicsAPI.wakeUp();
                physicsAPI.position.set(0, 1.25, 2);
                physicsAPI.mass.set(1);
                physicsAPI.velocity.set(-1, 0, 0);
            }
        }, delay);

    }, [mesh.current])
    useFrame(() => {
    })
    return (
        <group ref={gift}>
            <mesh ref={mesh} visible={false}>
                <boxBufferGeometry args={[0.4, 0.4, 0.4]} attach="geometry" />
                <meshPhongMaterial attach="material" color='green' />
            </mesh>
        </group>
    )
}

export default function GiftsPhysics() {
    const [floorCollider,] = useBox<InstancedMesh>((idx) => ({
        args: [6, .2, 6],
        position: [-2, 0, 3],
        rotation: [0, 0, 0],
        mass: 0
    }
    ));
    const [bandCollider,] = useBox<InstancedMesh>((idx) => ({
        args: [3, .75, .7],
        position: [-0.65, .6, 2.1],
        rotation: [0, 0, 0],
        mass: 0,
        material: {
            friction: 0
        }
    }
    ));
    const [boxCollider,] = useBox<InstancedMesh>((idx) => ({
        args: [1.8, .9, 2],
        position: [-3.4, .2, 3.8],
        rotation: [0, 0, 0],
        mass: 0
    }
    ));

    const [tableCollider,] = useCylinder<InstancedMesh>((idx) => (
        {
            args: [.65, .65, .85, 8],
            position: [-2.85, .3, 2],
            mass: 0
        }
    ));

    const getGifts = function () {
        let gifts = [];
        const giftNumber = 10;
        for (let i = 0; i < giftNumber; i++) {
            gifts.push(
                <GiftPhysics delay={3000 * i} lifetime={5000}></GiftPhysics>
            )
        }
        return gifts;
    }

    return (
        <group>
            {getGifts()}
        </group>
    );
}
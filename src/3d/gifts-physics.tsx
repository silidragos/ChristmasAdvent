import { useBox, useCylinder } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, InstancedMesh, Mesh } from "three";
import { factory } from "typescript";
import ElementFactory from "../services/ElementsFactory";


function GiftPhysics({ delay, lifetime, children }: { delay: number, lifetime: number, children: React.ReactNode }) {
    const mesh = useRef<Group>(null);

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

                setInterval(() => {
                    physicsAPI.position.set(0, 1.25, 2);
                    physicsAPI.mass.set(1);
                    physicsAPI.velocity.set(-1, 0, 0);
                }, lifetime)
            }
        }, delay);

    }, [mesh.current])
    useFrame(() => {
    })
    return (
        <group ref={gift}>
            <group ref={mesh} visible={false}>
                {children}
            </group>
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

    const [tableCollider,] = useCylinder<InstancedMesh>((idx) => (
        {
            args: [.65, .65, .85, 8],
            position: [-2.85, .3, 2],
            mass: 0
        }
    ));


    let texFactory: ElementFactory = useMemo(()=>{
        return new ElementFactory([
                <meshPhongMaterial attach="material" color="green"/>,
                <meshPhongMaterial attach="material" color="red"/>,
                <meshPhongMaterial attach="material" color="yellow"/>
        ]);
    },[]);

    let giftFactory: ElementFactory = useMemo(() => {
        return new ElementFactory([
            <mesh>
                <boxBufferGeometry args={[0.4, 0.4, 0.4]} attach="geometry" />
                {texFactory.getRandom()}
            </mesh>,
            <mesh>
                <sphereBufferGeometry args={[0.2, 8, 8]} attach="geometry" />
                {texFactory.getRandom()}
            </mesh>,
            <mesh>
                <torusKnotBufferGeometry args={[0.1, 0.05, 24, 6]} attach="geometry" />
                {texFactory.getRandom()}
            </mesh>,
        ]);
    }, []);

    const getGifts = function () {
        let gifts = [];
        const giftNumber = 5;
        for (let i = 0; i < giftNumber; i++) {
            gifts.push(
                <GiftPhysics key={i} delay={3000 * i} lifetime={3000 * giftNumber}>
                    {giftFactory.getRandom()}
                </GiftPhysics>
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
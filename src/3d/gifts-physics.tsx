import { useBox, useCylinder } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { Group, InstancedMesh } from "three";


function GiftPhysics(){
    const [gift, physicsAPI] = useBox<Group>((idx) => ({
        args: [.4, .4, .4],
        position: [0, 1.25, 2],
        rotation: [0, 0, 0],
        mass: 1,
        material:{
            friction: 0
        }
    }
    ));

    useEffect(()=>{
        physicsAPI.velocity.set(-1, 0, 0);
    },[])
    useFrame(()=>{
    })
    return(
        <group ref={gift}>
            <mesh>
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
        material:{
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

    const [tableCollider,] = useCylinder<InstancedMesh>((idx)=>(
        {
            args:[.65, .65, .85, 8],
            position:[-2.85, .3, 2],
            mass: 0
        }
    ));

    return (
        <group>
            <GiftPhysics/>
        </group>
    );
}
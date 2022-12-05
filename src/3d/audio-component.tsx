import { useRef, useMemo, useEffect, RefObject } from 'react';
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { PositionalAudio } from 'three';

export const listener = new THREE.AudioListener();

export const TryPlaySound = (sound: PositionalAudio)=>{
    if (sound === null || sound === undefined) {
        return;
    }

    if (sound.isPlaying) {
        sound.stop();
    }
    sound.play();
}

const AudioComponent = ({ url, volume = 1, autoplay = true, play = true, loop=false, onInit = (sound)=>{} } : {url : string, volume?: number, autoplay?: boolean, play?: boolean, loop?: boolean, onInit?:(sound : PositionalAudio)=>void}) => {
    const { camera } = useThree();
    const mainSound = useRef<PositionalAudio>(null);

    const buffer = useLoader(THREE.AudioLoader, url);

    useEffect(() => {
        if (mainSound.current === null || mainSound.current === undefined) return;

        mainSound.current.setBuffer(buffer);
        mainSound.current.setLoop(loop);
        mainSound.current.setVolume(volume);
        if (autoplay) {
            mainSound.current.play();
        }

        onInit(mainSound.current);
    }, [mainSound.current])

    useEffect(() => {
        if (mainSound.current === null || mainSound.current === undefined) return;

        if (play) {
            mainSound.current.play();
        } else {
            if (mainSound.current.isPlaying) {
                mainSound.current.stop();
            }
        }
    }, [play])
    return (
        <positionalAudio ref={mainSound} args={[listener]} />
    );


}

export default AudioComponent;
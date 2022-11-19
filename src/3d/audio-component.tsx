import { useRef, useMemo, useEffect } from 'react';
import { useThree, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { PositionalAudio } from 'three';

export const listener = new THREE.AudioListener();

const AudioComponent = ({ url, volume, autoplay = true, play = true, loop=false } : {url : string, volume: number, autoplay: boolean, play: boolean, loop: boolean}) => {
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
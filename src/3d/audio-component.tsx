import { useRef, useEffect } from 'react';
import { useLoader } from "@react-three/fiber";
import { AudioListener, PositionalAudio, AudioLoader } from 'three';

export const listener = new AudioListener();

listener.setMasterVolume(0);

document.addEventListener("muteStateUpdated", (ev) => {
  //@ts-ignore
  listener.setMasterVolume(ev.detail.isMute ? 0 : 1);
})

export const TryPlaySound = (sound: PositionalAudio) => {
  if (sound === null || sound === undefined) {
    return;
  }

  if (sound.isPlaying) {
    sound.stop();
  }
  sound.play();
}

interface Props {
  url: string;
  volume?: number;
  autoplay?: boolean;
  play?: boolean;
  loop?: boolean;
  onInit?: (sound: PositionalAudio) => void;
}

const AudioComponent = ({
  url,
  volume = 1,
  autoplay = true,
  play = true,
  loop = false,
  onInit = () => {},
}: Props) => {
  const mainSound = useRef<PositionalAudio>(null);

  const buffer = useLoader(AudioLoader, url);

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

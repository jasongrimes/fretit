import { useEffect, useRef } from "react";
import SoundPlayer from "../utils/sound-player";

interface UseSoundProps {
  tuning: number[];
  instrument?: string;
  muted?: boolean;
  onPlayString?: (stringNum: number) => void;
}
export default function useSound({
  tuning,
  instrument = undefined,
  muted = false,
  onPlayString,
}: UseSoundProps) {
  const playerRef = useRef<SoundPlayer | null>(null);

  useEffect(() => {
    // console.log("Entered useEffect");
    if (!muted && playerRef.current === null) {
      playerRef.current = new SoundPlayer(tuning, instrument);
    }

    return () => {
      // console.log("Entered useEffect cleanup");
      playerRef.current?.cleanup();
    };
  }, [instrument, tuning, muted]);

  const play = (stringNum: number, fretNum: number, delay?: number) => {
    if (muted) {
      return;
    }
    playerRef.current?.play(
      stringNum,
      fretNum,
      delay,
      onPlayString ? () => onPlayString(stringNum) : undefined,
    );
  };

  const strum = (voicing: number[], delayOffset = 0) => {
    if (muted) {
      return;
    }
    let delay = 0;
    for (let i = voicing.length; i >= 0; i--) {
      if (voicing[i] >= 0) {
        play(i + 1, voicing[i], delay * delayOffset);
        delay++;
      }
    }
  };

  const muteAll = () => {
    playerRef.current?.muteAll();
  };

  return { play, strum, muteAll, loading: playerRef.current === null };
}

import { useEffect, useRef } from "react";
import SoundPlayer from "../services/sound-player";

interface UseSoundProps {
  tuning: number[];
  instrument?: string;
  muted?: boolean;
}
export default function useSound({
  tuning,
  instrument = undefined,
  muted = false,
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
    playerRef.current?.play(stringNum, fretNum, delay);
  };

  const strum = (voicing: number[], delayOffset = 0.05) => {
    // !muted && playerRef.current?.strum(voicing, delayOffset);
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

  return { play, strum, loading: playerRef.current === null };
}

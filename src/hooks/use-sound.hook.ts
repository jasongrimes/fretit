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
  console.log("Entered useSound"); // ,tuning, instrument, muted);
  const playerRef = useRef<SoundPlayer | null>(null);

  useEffect(() => {
    console.log("Entered useEffect");
    if (!muted && playerRef.current === null) {
      playerRef.current = new SoundPlayer(tuning, instrument);
    }

    return () => {
      console.log("Entered useEffect cleanup");
      playerRef.current?.cleanup();
      //playerRef.current = null;
    };
  }, [instrument, tuning, muted]);

  const play = (stringNum: number, fretNum: number, delay?: number) => {
    !muted && playerRef.current?.play(stringNum, fretNum, delay);
  };

  const strum = (voicing: number[], delayOffset?: number) => {
    console.log(voicing);
    !muted && playerRef.current?.strum(voicing, delayOffset);
  };

  return { play, strum, loading: playerRef.current === null };
}

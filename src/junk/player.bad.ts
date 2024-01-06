import { Soundfont } from "smplr";

export type StringInstrument = (tuning: number[]) => {
  play: (string: number, fret: number, when: number) => void;
  dispose: () => void;
};

export interface Player {
  play: (string: number, fret: number, when: number) => Promise<void>;
  dispose: () => void;
}

export default async function makePlayer (
  instrument: StringInstrument,
  tuning: number[],
): Promise<Player> => {
  const { play, dispose } = await instrument(tuning);

  return {
    play,
    dispose,
  };
};

export function withSoundFont(
  instrumentName: string,
  options?: {
    soundfont?: "FluidR3_GM" | "MusyngKite";
  },
): StringInstrument {
  return async (tuning) => {
    console.count("Entered withSoundFont()");
    const audioContext = new AudioContext();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const player: Soundfont = await new Soundfont(audioContext, {
      instrument: instrumentName,
      ...options,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    }).load;

    return {
      play: (string, fret, when = 0) => {
        console.log("Entered play()");
        void audioContext.resume().then(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          player.start({
            note: tuning[string] + fret,
            time: audioContext.currentTime + when,
            // duration: 4,
            velocity: 100,
          });
        });
      },
      dispose: () => {
        console.log("Entered dispose()");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        player.stop();
        void audioContext.close();
        throw new Error();
      },
    };
  };
}

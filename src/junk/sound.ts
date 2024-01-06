import { Soundfont } from "smplr";

export interface SoundPlayer {
  play: (stringNum: number, fretNum: number, delay?: number) => void;
  strum: (voicing: number[]) => void;
  mute: (stringNum: number) => void;
  dispose: () => void;
}

// TODO: Refactor all this into a SoundPlayer object,
// and return the object instead of the individual methods,
// which are then invoked as player.play(), player.strum, etc.

export default function makePlayer(
  instrument: string,
  tuning: number[],
): SoundPlayer {
  console.log("Entered makePlayer");
  const audioContext = new AudioContext();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const player = new Soundfont(audioContext, { instrument });
  const stringMuters: (((time?: number | undefined) => void) | undefined)[] =
    tuning.map(() => undefined);

  return {
    play: (stringNum: number, fretNum: number, delay = 0): void => {
      console.log("Entered SoundPlayer.play()");
      //console.log(player);

      if (fretNum < 0) {
        //this.mute(stringNum);
        return;
      }
      const midi = tuning[stringNum - 1] + fretNum;
      console.log("Playing midi note:", midi);

      void audioContext.resume();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      stringMuters[stringNum - 1] = player.start({
        note: midi,
        velocity: 100,
        time: audioContext.currentTime + delay,
      });

      // TODO: Set timer to clear the string muter
      //console.log(stringMuters);
    },

    strum: (voicing: number[]) => {
      voicing.reverse.map((fretNum: number, stringIdx: number) => {
        this.play(stringIdx + 1, fretNum);
      });
    },

    mute: (stringNum) => {
      stringMuters[stringNum - 1]?.();
      stringMuters[stringNum - 1] = undefined;
    },

    dispose() {},
  } as SoundPlayer;
}

import { Soundfont } from "smplr";

export default class SoundPlayer {
  audioContext: AudioContext;
  player: Soundfont;
  stringMuters: ((() => void) | undefined)[];
  tuning: number[];

  constructor(tuning: number[], instrument = "acoustic_guitar_steel") {
    this.audioContext = new AudioContext();
    // The Soundfont type definition from smplr is incorrect, causing typescript linting errors. Silence them for now.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.player = new Soundfont(this.audioContext, { instrument });
    this.stringMuters = tuning.map(() => undefined);
    this.tuning = tuning;
  }

  play(
    stringNum: number,
    fretNum: number,
    delay = 0,
    onStart: (() => void) | undefined = undefined,
  ) {
    this.mute(stringNum);
    if (fretNum < 0) {
      return;
    }
    const midi: number = this.tuning[stringNum - 1] + fretNum;

    void this.audioContext.resume().then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.stringMuters[stringNum - 1] = this.player.start({
        note: midi,
        velocity: 127,
        time: this.audioContext.currentTime + delay,
        onStart,
      });
    });
  }

  /*
  strum(voicing: number[], delayOffset = 0.03) {
    let delay = 0;
    for (let i = voicing.length; i >= 0; i--) {
      if (voicing[i] >= 0) {
        this.play(i + 1, voicing[i], delay * delayOffset);
        delay++;
      }
    }
  }
  */

  mute(stringNum: number) {
    this.stringMuters[stringNum - 1]?.();
    this.stringMuters[stringNum - 1] = undefined;
  }

  cleanup() {
    //void this.audioContext.close();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.player.stop();
    this.stringMuters = this.tuning.map(() => undefined);
  }
}

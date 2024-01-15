import { Soundfont } from "smplr";

export default class SoundPlayer {
  audioContext: AudioContext;
  player: Soundfont;
  stringMuters: ((() => void) | undefined)[];
  tuning: number[];

  constructor(tuning: number[], instrument = "acoustic_guitar_steel") {
    this.audioContext = new AudioContext();
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
      this.stringMuters[stringNum - 1] = this.player.start({
        note: midi,
        velocity: 127,
        time: this.audioContext.currentTime + delay,
        onStart,
      });
    });
  }

  mute(stringNum: number) {
    this.stringMuters[stringNum - 1]?.();
    this.stringMuters[stringNum - 1] = undefined;
  }

  muteAll() {
    this.player.stop();
  }

  cleanup() {
    this.player.stop();
    this.stringMuters = this.tuning.map(() => undefined);
  }
}

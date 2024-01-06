import { Soundfont } from "smplr";
import makePlayer, { Player, withSoundFont } from "./player.bad";

let context: AudioContext;
let player: Player;

interface Player {
  disconnect(): void;
  start(sample: string | number): (time?: number | undefined) => void;
  stop(sample?: string | number): void;
}

export async function testSoundSimple() {
  console.log("testing sound");
  context = context || new AudioContext();
  await context.resume();

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  player = player || await new Soundfont(context, { instrument: "acoustic_guitar_steel" }).load as unknown as Player;

  player.start("C3");
}

export async function testSound() {
  const instrument = withSoundFont("acoustic_guitar_nylon");
  const tuning = [64, 59, 55, 50, 45, 40];
  let playing = tuning.map(() => false);
  function setPlaying(newPlaying: boolean[]) {
    playing = newPlaying;
  }
  // let player;
  // function setPlayer(newPlayer: Player) {
  // player = newPlayer;
  // }
  // const promise = makePlayer(instrument, tuning, setPlaying);
  // void promise.then(setPlayer);
  const player = await makePlayer(instrument, tuning, setPlaying);

  const string = 0;
  const fret = 0;
  const when = 0;
  await player?.play(string, fret, when);
}

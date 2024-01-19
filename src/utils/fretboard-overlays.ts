import { Key, Voicing } from "@/types";
import { Interval, Note } from "tonal";

export type LabelingStrategy =
  | "none"
  | "pitch"
  | "pitchClass"
  | "chordInterval"
  | "scaleInterval";

/**
 * Maps fret numbers to their overlay label and style.
 */
export type StringOverlays = Record<
  number,
  { label: string; type?: string; style?: string; isTransparent?: boolean }
>;

export default function createOverlays ({
  tuning,
  voicing,
  key,
  chordRoot,
  chordStrategy = "none",
  scaleStrategy = "none",
  position,
}: {
  tuning: number[];
  voicing: Voicing;
  key: Key;
  chordRoot: string;
  chordStrategy: LabelingStrategy;
  scaleStrategy: LabelingStrategy;
  position?: number;
  }): StringOverlays[] {
  const numFrets = 15;
  const minFret = position ?? 0;
  const maxFret = position === undefined ? 15 : minFret + 4;
  const chordRootMidi = getMidiFromPitchClass(chordRoot);

  const overlays = Array.from(tuning, (stringMidi, stringIndex) => {
    const stoppedFret = voicing[stringIndex];
    const stringOverlays: StringOverlays = {};
    for (let fret = 0; fret <= numFrets; fret++) {
      const midi = stringMidi + fret;
      const chroma = midi % 12;
      if (stoppedFret === fret) {
        const interval = getIntervalName(chordRootMidi, midi);
        stringOverlays[fret] = {
          label: getMidiLabel(midi, chordStrategy, key, chordRootMidi),
          style: interval === "1" ? "chord-root" : "chord",
        };
      } else if (fret >= minFret && fret <= maxFret && key.scaleChromas.includes(chroma)) {
        stringOverlays[fret] = {
          label: getMidiLabel(midi, scaleStrategy, key, key.scaleChromas[0]),
          style: "scale",
        };
      }
    }
    return stringOverlays;
  });

  return overlays;
}

function getIntervalName(fromMidi: number, toMidi: number) {
  const semitones = (toMidi - fromMidi) % 12;
  const interval = Interval.get(Interval.fromSemitones(semitones));
  return `${interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : ""}${
    interval.simple === 8 ? 1 : interval.simple
  }`;
}

function getMidiFromPitchClass(pitchClass: string) {
  return Note.midi(pitchClass + 1) ?? 0; // Ex. C1
}

function getMidiLabel(
  midi: number,
  strategy: LabelingStrategy,
  key: Key,
  chordRootMidi = 0,
) {
  switch (strategy) {
    case "pitch":
      return getMidiPitch(midi, key);
    case "pitchClass":
      return Note.pitchClass(getMidiPitch(midi, key));
    case "scaleInterval":
      return getIntervalName(key.scaleChromas[0], midi);
    case "chordInterval": {
      const intervalName = getIntervalName(chordRootMidi, midi);
      return intervalName === "1" ? "R" : intervalName;
    }
    default:
      return "";
  }
}

function getMidiPitch(midi: number, key: Key) {
  // If the note is in the key, use the note name from the key.
  const chroma = midi % 12;
  const i = key.scaleChromas.indexOf(chroma);
  if (i !== -1) {
    const pitchClass = key.scaleNotes[i];
    const octave = Math.floor(midi / 12) - 1;
    return pitchClass + octave;
  }
  
  return key.preferSharps ? Note.fromMidiSharps(midi) : Note.fromMidi(midi);
}

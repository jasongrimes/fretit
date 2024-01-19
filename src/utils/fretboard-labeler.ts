import { FretboardLocation, Key, StringOverlays } from "@/types";
import { Interval, Note } from "tonal";
import { Voicing } from "./chord-calculator";

//
// Types
//

export type LabelingStrategy =
  | "none"
  | "pitch"
  | "pitchClass"
  | "chordInterval"
  | "scaleInterval";

/**
 * Fretboard labeler
 */
export class FretboardLabeler {
  tuning: number[];
  key!: Key;
  chordRoot: string;
  chordStrategy: LabelingStrategy;
  scaleStrategy: LabelingStrategy;

  constructor({
    tuning,
    key,
    chordRoot,
    chordStrategy = "none",
    scaleStrategy = "none",
  }: {
    tuning: number[];
    key: Key;
    chordRoot: string;
    chordStrategy: LabelingStrategy;
    scaleStrategy: LabelingStrategy;
  }) {
    this.tuning = tuning;
    this.key = key;
    this.chordRoot = chordRoot;
    this.chordStrategy = chordStrategy;
    this.scaleStrategy = scaleStrategy;
  }

  getLocationLabel(
    location: FretboardLocation,
    strategy: LabelingStrategy,
  ): string {
    const midi = this.getLocationMidi(location);
    return this.getMidiLabel(midi, strategy);
  }

  getMidiLabel(midi: number, scheme: LabelingStrategy) {
    switch (scheme) {
      case "pitch":
        return this.getMidiPitch(midi);
      case "pitchClass":
        return Note.pitchClass(this.getMidiPitch(midi));
      case "scaleInterval":
      case "chordInterval": {
        const refPitchClass =
          scheme === "chordInterval" ? this.chordRoot : this.key.tonic;
        if (!refPitchClass) {
          return "";
        }

        const refMidi = this.getMidiFromPitchClass(refPitchClass);
        const intervalName = this.getMidiIntervalName(refMidi, midi);
        return (scheme === "chordInterval" && intervalName === "1") ? "R" : intervalName;
      }
      default:
        return "";
    }
  }

  getMidiFromPitchClass(pitchClass: string) {
    return Note.midi(pitchClass + 1) ?? 0; // Ex. C1
  }

  getMidiIntervalName(fromMidi: number, toMidi: number) {
    const semitones = (toMidi - fromMidi) % 12;
    const interval = Interval.get(Interval.fromSemitones(semitones));
    return `${interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : ""}${
      interval.simple === 8 ? 1 : interval.simple
    }`;
  }

  getMidiPitch(midi: number) {
    return this.key.preferSharps
      ? Note.fromMidiSharps(midi)
      : Note.fromMidi(midi);
  }

  getLocationPitch(location: FretboardLocation) {
    return this.getMidiPitch(this.getLocationMidi(location));
  }

  getLocationPitchClass(location: FretboardLocation) {
    return Note.pitchClass(this.getLocationPitch(location));
  }

  getLocationStyle(location: FretboardLocation) {
    if (
      this.chordRoot &&
      Note.chroma(this.chordRoot) ===
        Note.chroma(this.getLocationPitchClass(location))
    ) {
      return "chord-root";
    }
    return;
  }

  getLocationMidi([stringNum, fretNum]: FretboardLocation): number {
    if (stringNum > this.tuning.length) {
      return 0;
    }
    return this.tuning[stringNum - 1] + fretNum;
  }

  getOverlays(voicing: Voicing, positionNum: number | null = null) {
    const minFret = positionNum ?? 0;
    const maxFret = positionNum === null ? 15 : minFret + 4;
    const overlays = Array.from(this.tuning, (stringMidi, stringIndex) => {
      const stringOverlays: StringOverlays = {};
      for (let fret = minFret; fret <= maxFret; fret++) {
        const midi = stringMidi + fret;
        const chroma = midi % 12;
        if (voicing[stringIndex] === fret) {
          const interval = this.getMidiIntervalName(this.getMidiFromPitchClass(this.chordRoot), midi);
          stringOverlays[fret] = {
            label: this.getMidiLabel(midi, this.chordStrategy),
            style: interval === "1" ? "chord-root" : "chord",
          };
        } else if (this.key.scaleChromas.includes(chroma)) {
          stringOverlays[fret] = {
            label: this.getMidiLabel(midi, this.scaleStrategy),
            style: "scale",
          };
        }
      }
      return stringOverlays;
    });

    return overlays;
  }
}

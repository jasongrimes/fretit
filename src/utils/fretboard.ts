import { FretboardLocation } from "@/types";
import { Interval, Note } from "tonal";

//
// Types
//

export type LabelingScheme =
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
  scheme: LabelingScheme;
  root?: string;
  tonic: string;
  preferSharps: boolean;

  constructor({
    tuning,
    labelingScheme,
    tonic,
    root,
    preferSharps,
  }: {
    tuning: number[];
    labelingScheme: LabelingScheme;
    tonic: string;
    root?: string;
    preferSharps: boolean;
  }) {
    this.tuning = tuning;
    this.scheme = labelingScheme;
    this.root = root;
    this.tonic = tonic;
    this.preferSharps = preferSharps;
  }

  getLocationLabel(location: FretboardLocation): string {
    const midi = this.getLocationMidi(location);

    return this.getMidiLabel(midi, this.scheme);
  }

  getMidiLabel(midi: number, scheme: LabelingScheme) {
    switch (scheme) {
      case "pitch":
        return this.getMidiPitch(midi);
      case "pitchClass":
        return Note.pitchClass(this.getMidiPitch(midi));
      case "scaleInterval":
      case "chordInterval": {
        const refPitchClass =
          scheme === "chordInterval" ? this.root : this.tonic;
        if (!refPitchClass) {
          return "";
        }

        const refMidi = Note.midi(refPitchClass + 1) ?? 0; // Ex. C1
        const semitones = (midi - refMidi) % 12;
        const interval = Interval.get(Interval.fromSemitones(semitones));
        let intervalName = `${
          interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : ""
        }${interval.simple === 8 ? 1 : interval.simple}`;
        if (scheme === "chordInterval" && intervalName === "1") {
          intervalName = "R";
        }
        return intervalName;
      }
      default:
        return "";
    }
  }

  getMidiPitch(midi: number) {
    return this.preferSharps ? Note.fromMidiSharps(midi) : Note.fromMidi(midi);
  }

  getLocationPitch(location: FretboardLocation) {
    return this.getMidiPitch(this.getLocationMidi(location));
  }

  getLocationPitchClass(location: FretboardLocation) {
    return Note.pitchClass(this.getLocationPitch(location));
  }

  getLocationStyle(location: FretboardLocation) {
    if (
      this.root &&
      Note.chroma(this.root) ===
        Note.chroma(this.getLocationPitchClass(location))
    ) {
      return "root";
    }
    return;
  }

  getLocationMidi([stringNum, fretNum]: FretboardLocation): number {
    if (stringNum > this.tuning.length) {
      return 0;
    }
    return this.tuning[stringNum - 1] + fretNum;
  }
}

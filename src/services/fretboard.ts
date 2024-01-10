import { Interval, Note } from "tonal";

//
// Types
//
export interface Instrument {
  name: string;
  tuning: number[];
  fretMarkers: number[];
  doubleFretMarkers: number[];
}

export interface FretboardSettings {
  instrument: string;
  lowestFret: number;
  highestFret: number;
  tonic: string;
  labeling: LabelingScheme;
  preferSharps: boolean;
}

export type LabelingScheme =
  | "none"
  | "pitch"
  | "pitchClass"
  | "chordInterval"
  | "scaleInterval";

export interface ChordGrip {
  name: string;
  root?: string;
  voicing: number[];
}

export type FretboardLocation = [stringNum: number, fretNum: number];

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

  getLocationMidi([stringNum, fretNum]: FretboardLocation) {
    if (stringNum > this.tuning.length) {
      return 0;
    }
    return this.tuning[stringNum - 1] + fretNum;
  }

  getLocationLabel(location: FretboardLocation): string {
    const midi = this.getLocationMidi(location);

    switch (this.scheme) {
      case "pitch":
        return this.getMidiPitch(midi);
      case "pitchClass":
        return Note.pitchClass(this.getMidiPitch(midi));
      case "scaleInterval":
      case "chordInterval": {
        const refPitchClass =
          this.scheme === "chordInterval" ? this.root : this.tonic;
        if (!refPitchClass) {
          return "";
        }
        const refMidi = Note.midi(refPitchClass + 1) ?? 0; // Ex. C1
        const semitones = (midi - refMidi) % 12;
        const interval = Interval.get(Interval.fromSemitones(semitones));
        let intervalName = `${
          interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : ""
        }${interval.simple === 8 ? 1 : interval.simple}`;
        if (this.scheme === "chordInterval" && intervalName === "1") {
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
    if (this.root === this.getLocationPitchClass(location)) {
      return "root";
    }
    return;
  }
}

import { Interval, Note } from "tonal";

export type FretboardLocation = [stringNum: number, fretNum: number];

export interface Instrument {
  name: string;
  tuning: number[];
  fretMarkers: number[];
  doubleFretMarkers: number[];
}
export const INSTRUMENTS: Record<string, Instrument> = {
  Guitar: {
    name: "Guitar",
    tuning: [64, 59, 55, 50, 45, 40],
    fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
    doubleFretMarkers: [12, 24],
  },
};

export interface DiagramSettings {
  instrument: string;
  lowestFret: number;
  highestFret: number;
  tonic: string;
  labeling: LabelingScheme;
  preferSharps: boolean;
}
export const DEFAULT_DIAGRAM_SETTINGS: DiagramSettings = {
  instrument: "Guitar",
  lowestFret: 0,
  highestFret: 12,
  tonic: "C",
  labeling: "scaleInterval",
  preferSharps: false,
};

export interface FretboardControlSettings {
  pointerBehavior: "pick" | "toggle" | "edit";
}
export const DEFAULT_CONTROL_SETTINGS: FretboardControlSettings = {
  pointerBehavior: "pick",
};

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
export const DEFAULT_GRIPS: ChordGrip[] = [
  {
    name: "C",
    root: "C",
    voicing: [0, 1, 0, 2, 3, -1],
  },
  {
    name: "Dm",
    root: "D",
    voicing: [1, 3, 2, 0, -1, -1],
  },
  {
    name: "Em",
    root: "E",
    voicing: [0, 0, 0, 2, 2, 0],
  },
  {
    name: "F",
    root: "F",
    voicing: [1, 1, 2, 3, 3, 1],
  },
  {
    name: "G",
    root: "G",
    voicing: [3, 0, 0, 0, 2, 3],
  },
  {
    name: "Am",
    root: "A",
    voicing: [0, 1, 2, 2, 0, -1],
  },
  {
    name: "Bdim",
    root: "B",
    voicing: [1, 0, -1, 0, 2, -1],
  },
  {
    name: "G7",
    root: "G",
    voicing: [1, 0, 0, 0, 2, 3],
  },
];

/**
 * Fretboard labeler
 */
export interface LabelerConfig {
  tuning: number[];
  labelingScheme: LabelingScheme;
  tonic: string;
  root?: string;
  preferSharps: boolean;
}
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
  }: LabelerConfig) {
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
    console.log(this.root, this.getLocationPitchClass(location));
    if (this.root === this.getLocationPitchClass(location)) {
      return "root";
    }
    return;
  }
}

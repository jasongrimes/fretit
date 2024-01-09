import { Interval, Note } from "tonal";

export type FretboardLocation = [stringNum: number, fretNum: number];

export interface FretboardSettings {
  instrument: string;
  tuning: number[];
  lowestFret: number;
  highestFret: number;
  fretMarkers: number[];
  doubleFretMarkers: number[];
}
export const DEFAULT_FRETBOARD_SETTINGS: FretboardSettings = {
  instrument: "Guitar",
  tuning: [64, 59, 55, 50, 45, 40],
  lowestFret: 0,
  highestFret: 12,
  fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  doubleFretMarkers: [12, 24],
};

export interface FretboardControlSettings {
  pointerBehavior: "pick" | "toggle" | "edit";
}
export const DEFAULT_CONTROL_SETTINGS: FretboardControlSettings = {
  pointerBehavior: "pick",
};

export interface LabelerSettings {
  preferSharps: boolean;
  scheme: LabelingScheme;
  root: string;
  tonic: string;
}
export type LabelingScheme =
  | "none"
  | "pitch"
  | "pitchClass"
  | "chordInterval"
  | "scaleInterval";
export const DEFAULT_LABELER_SETTINGS: LabelerSettings = {
  preferSharps: true,
  scheme: "chordInterval",
  root: "C",
  tonic: "C",
};

/*
export interface FretboardDiagram {
  uid: string | null;
  name: string;
  longName: string;
  sortOrder: number;
  // labeling: LabelerSettings;
  voicing: number[];
}
export const DEFAULT_GRIP: ChordGrip = {
  name: "C",
  longName: "C major",
  sortOrder: 0,
  // labeling: DEFAULT_LABELER_SETTINGS, // TODO: Move to fretboard settings?
  voicing: [-1, 1, 0, 2, 3, -1],
};
*/

export interface ChordGrip {
  name: string;
  longName?: string;
  root?: string;
  voicing: number[];
}
export const DEFAULT_GRIPS: ChordGrip[] = [
  {
    name: "C",
    longName: "C major",
    root: "C",
    voicing: [0, 1, 0, 2, 3, -1],
  },
  {
    name: "Dm",
    longName: "D minor",
    root: "D",
    voicing: [1, 3, 2, 0, -1, -1],
  },
  {
    name: "Em",
    longName: "E minor",
    root: "E",
    voicing: [0, 0, 0, 2, 2, 0],
  },
  {
    name: "F",
    longName: "F major",
    root: "F",
    voicing: [1, 1, 2, 3, 3, 1],
  },
  {
    name: "G",
    longName: "G major",
    root: "G",
    voicing: [3, 0, 0, 0, 2, 3],
  },
  {
    name: "Am",
    longName: "A minor",
    root: "A",
    voicing: [0, 1, 2, 2, 0, -1],
  },
  {
    name: "Bdim",
    longName: "B diminished",
    root: "B",
    voicing: [1, 0, -1, 0, 2, -1],
  },
  {
    name: "G7",
    longName: "G dominant 7",
    root: "G",
    voicing: [1, 0, 0, 0, 2, 3],
  },
];

/**
 * Fretboard labeler
 */
export class FretboardLabeler {
  tuning: number[];
  labeling: LabelerSettings;

  constructor(tuning: number[], labeling: LabelerSettings) {
    this.tuning = tuning;
    this.labeling = labeling;
  }

  getLocationMidi([stringNum, fretNum]: FretboardLocation) {
    if (stringNum > this.tuning.length) {
      return 0;
    }
    return this.tuning[stringNum - 1] + fretNum;
  }

  getLocationLabel(location: FretboardLocation): string {
    const midi = this.getLocationMidi(location);

    const scheme = this.labeling.scheme;
    switch (scheme) {
      case "pitch":
      case "pitchClass": {
        const pitch = this.labeling.preferSharps
          ? Note.fromMidiSharps(midi)
          : Note.fromMidi(midi);
        if (scheme === "pitch") {
          return pitch;
        }
        return Note.pitchClass(pitch);
      }
      case "scaleInterval":
      case "chordInterval": {
        const rootPitchClass =
          scheme === "chordInterval" ? this.labeling.root : this.labeling.tonic;
        const rootMidi = Note.midi(rootPitchClass + 1) ?? 0; // Ex. C1
        const semitones = (midi - rootMidi) % 12;
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
}

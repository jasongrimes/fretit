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
  highestFret: 7,
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

export interface FretboardDiagram {
  uid: string | null;
  name: string;
  longName: string;
  sortOrder: number;
  labeling: LabelerSettings;
  voicing: number[];
}
export const DEFAULT_DIAGRAM: FretboardDiagram = {
  uid: null,
  name: "C",
  longName: "C major",
  sortOrder: 0,
  labeling: DEFAULT_LABELER_SETTINGS,
  voicing: [-1, 1, 0, 2, 3, -1],
};

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

/*
export function findDotByString(
  dots: FretboardDiagramDot[],
  stringNum: number,
) {
  return dots.find((dot) => dot.location[0] === stringNum);
}

export function removeDotByLocation(dots: FretboardDiagramDot[], location: FretboardLocation) {
  return dots.filter((dot) => dot.location[0] !== location[0] || dot.location[1] !== location[1]);
}
*/

/*
export function filterDotsByString(
  stringNum: number,
  dots: FretboardDiagramDot[] = [],
): FretboardDiagramDot[] {
  return dots.filter((dot) => dot.location[0] === stringNum);
}

export function filterDotsByFret(
  fretNum: number,
  dots: FretboardDiagramDot[] = [],
): FretboardDiagramDot[] {
  return dots.filter((dot) => dot.location[1] === fretNum);
}
*/
/*
export function updateDiagramLabels(
  diagram: FretboardDiagram,
  settings: FretboardSettings,
): FretboardDiagram {
  const stops = diagram.stops?.map((dot) => {
    if (!dot.noAutoLabel) {
      return {
        ...dot,
        label: getLocationLabel(dot.location, settings, diagram.labeling),
      };
    }
  }) as FretboardDiagramDot[];
  return {
    ...diagram,
    stops: stops,
  };
}
*/

/*
function getLocationPitch(
  location: FretboardLocation,
  settings: FretboardSettings,
  labeling: LabelingSettings,
) {
  const [stringNum, fretNum] = location;
  const lowestFret = settings.lowestFret ?? 0;
  const stringPitch = settings.tuning[stringNum - 1];
  if (!stringPitch) {
    throw new Error(`Unknown tuning for string ${stringNum}`);
  }

  const stringMidi = Note.midi(stringPitch) ?? 0;
  if (labeling.preferSharps) {
    return Note.fromMidiSharps(stringMidi + lowestFret + fretNum);
  }

  return Note.fromMidi(stringMidi + lowestFret + fretNum);
}

export function getLocationLabel(
  location: FretboardLocation,
  settings: FretboardSettings,
  labeling: LabelingSettings,
) {
  const pitch = getLocationPitch(location, settings, labeling);
  switch (labeling.scheme) {
    case "pitch":
      return pitch;
    case "pitchClass":
      return Note.pitchClass(pitch);
    case "chordInterval":
    case "scaleInterval": {
      const pitchMidi = Note.midi(pitch) ?? 0;
      const intervalRef = labeling.intervalRef ?? [settings.tuning.length, 0];
      const refMidi =
        Note.midi(getLocationPitch(intervalRef, settings, labeling)) ?? 0;
      const semitones = pitchMidi - refMidi;
      const interval = Interval.get(Interval.fromSemitones(semitones));
      // prettier-ignore
      let intervalName = `${interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : "" }${interval.simple === 8 ? 1 : interval.simple}`;
      if (labeling.scheme === "chordInterval" && intervalName === "1") {
        intervalName = "R";
      }
      return intervalName;
    }
  }
}
*/

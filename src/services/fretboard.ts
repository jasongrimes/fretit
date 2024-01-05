import { Interval, Note } from "tonal";

export interface FretboardSettings {
  instrument: string;
  tuning: string[];
  numFrets: number;
  isMovable: boolean;
  lowestFret: number;
  fretMarkers: number[];
  doubleFretMarkers: number[];
  pointerBehavior: "pick" | "toggle" | "edit";
}

export interface FretboardDiagram {
  uid: string | null;
  name: string;
  longName: string;
  sortOrder: number;
  labeling: LabelingSettings;
  stops: FretboardDiagramDot[];
  overlays?: FretboardDiagramDot[];
  voicing: number[];
}

export interface LabelingSettings {
  preferSharps: boolean;
  scheme: DiagramLabelingScheme;
  intervalRef?: FretboardLocation;
}

export type DiagramLabelingScheme =
  | "none"
  | "scaleInterval"
  | "chordInterval"
  | "pitch"
  | "pitchClass";

export interface FretboardDiagramDot {
  location: FretboardLocation;
  label: string;
  noAutoLabel?: boolean;
  customStyle?: string;
}

export type FretboardLocation = [stringNum: number, fretNum: number];

export function findDotByString(
  dots: FretboardDiagramDot[],
  stringNum: number,
) {
  return dots.find((dot) => dot.location[0] === stringNum);
}

export function removeDotByLocation(dots: FretboardDiagramDot[], location: FretboardLocation) {
  return dots.filter((dot) => dot.location[0] !== location[0] || dot.location[1] !== location[1]);
}

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

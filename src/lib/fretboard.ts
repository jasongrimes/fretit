import { Interval, Note } from "tonal";

export interface FretboardSettings {
  instrument: string;
  tuning: string[];
  numFrets: number;
  isMovable: boolean;
  lowestFret: number;
  fretMarkers: number[];
  doubleFretMarkers: number[];
}

export interface FretboardDiagram {
  uid: string | null;
  name: string;
  longName: string;
  sortOrder: number;
  labeling: LabelingSettings;
  stops: FretboardDiagramDot[];
  overlays?: FretboardDiagramDot[];
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


// export function setDiagramStop(diagram: FretboardDiagram, stringNum: number, fretNum: number, dot: FretboardDiagramDot | null) {

// }

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

function updateDiagramLabels(
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
) {
  const [stringNum, fretNum] = location;
  const lowestFret = settings.lowestFret ?? 0;
  const stringPitch = settings.tuning[stringNum - 1];
  if (!stringPitch) {
    throw new Error(`Unknown tuning for string ${stringNum}`);
  }

  const pitch = Note.transpose(
    stringPitch,
    Interval.fromSemitones(lowestFret + fretNum),
  );

  // TODO: Handle preferred accidentals
  return pitch;
}

function getLocationLabel(
  location: FretboardLocation,
  settings: FretboardSettings,
  labeling: LabelingSettings,
) {
  const pitch = getLocationPitch(location, settings);

  switch (labeling.scheme) {
    case "pitch":
      return pitch;
    case "pitchClass":
      return Note.pitchClass(pitch);
    case "chordInterval":
    case "scaleInterval": {
      const pitchMidi = Note.midi(pitch) ?? 0;
      const intervalRef = labeling.intervalRef ?? [settings.tuning.length, 0];
      const refMidi = Note.midi(getLocationPitch(intervalRef, settings)) ?? 0;
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

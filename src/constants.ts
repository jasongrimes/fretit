import type {
  FretboardDiagram,
  FretboardLocation,
  FretboardSettings,
  LabelingSettings,
} from "./services/fretboard";

export const DEFAULT_FRETBOARD_SETTINGS: FretboardSettings = {
  instrument: "Guitar",
  tuning: ["E4", "B3", "G3", "D3", "A2", "E2"],
  fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  doubleFretMarkers: [12, 24],
  lowestFret: 0,
  numFrets: 7,
  pointerBehavior: "pick",
};

export const DEFAULT_LABELING_SETTINGS: LabelingSettings = {
  preferSharps: true,
  scheme: "pitchClass",
  intervalRef: [5, 3],
};

export const DEFAULT_DIAGRAM: FretboardDiagram = {
  uid: null,
  name: "C",
  longName: "C major",
  sortOrder: 0,
  labeling: DEFAULT_LABELING_SETTINGS,
  stops: [
    { location: [5, 3] as FretboardLocation, label: "C" },
    { location: [4, 2] as FretboardLocation, label: "E" },
    { location: [3, 0] as FretboardLocation, label: "G" },
    { location: [2, 1] as FretboardLocation, label: "C" },
  ],
  voicing: [-1, 1, 0, 2, 3, -1],
};

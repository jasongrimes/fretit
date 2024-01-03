import {
  FretboardDiagram,
  FretboardLocation,
  type FretboardSettings,
  type LabelingSettings,
} from "./components/Fretboard";

export const DEFAULT_FRETBOARD_SETTINGS: FretboardSettings = {
  instrument: "Guitar",
  tuning: ["E4", "B3", "G3", "D3", "A2", "E2"],
  fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  doubleFretMarkers: [12, 24],
  numFrets: 7,
  isMovable: false,
  lowestFret: 0,
};

export const DEFAULT_LABELING_SETTINGS: LabelingSettings = {
  preferSharps: false,
  scheme: "pitch",
  intervalRef: undefined,
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
};
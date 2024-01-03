import Fretboard, {
  DiagramLabelingScheme,
  FretboardDiagram,
  FretboardSettings,
  LabelingSettings,
  type FretboardLocation,
} from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

import { Interval, Note } from "tonal";

export default function FretboardEditor() {
  const settings = fretboardData.settings;

  const diagram = updateDiagramLabels(fretboardData.diagrams[0], settings);

  return (
    <div className="fretboard-editor mx-auto max-w-96">
      <Fretboard settings={settings} diagram={diagram} />
      <FretboardControls />
      <FretboardSettingsForm />
    </div>
  );
}

const fretboardData = {
  uid: "xY32ch",
  name: null,
  settings: {
    tuning: ["E4", "B3", "G3", "D3", "A2", "E2"],
    numFrets: 12,
    isMovable: false,
    lowestFret: 0,
    fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
    doubleFretMarkers: [12, 24],
  },
  diagrams: [
    {
      uid: "abc123",
      name: "C",
      longName: "C major",
      sortOrder: 0,
      labeling: {
        preferSharps: false,
        scheme: "chordInterval" as DiagramLabelingScheme,
        intervalRef: [5, 3] as FretboardLocation,
      },
      stops: [
        { location: [5, 3] as FretboardLocation, label: "C" },
        { location: [4, 2] as FretboardLocation, label: "E" },
        { location: [3, 0] as FretboardLocation, label: "G" },
        { location: [2, 1] as FretboardLocation, label: "C" },
      ],
      overlays: undefined,
    },
  ],
};

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
  });
  return {
    ...diagram,
    stops: stops,
  };
}
/*
function testTonal() {
  // const pitch = getLocationPitch([5, 3], fretboardData.settings);
  const label = getLocationLabel(
    [2, 13],
    fretboardData.settings,
    "scaleInterval",
    [5, 3],
  );
  console.log(label);
}
*/

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
      console.log(refMidi, pitchMidi, semitones);
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

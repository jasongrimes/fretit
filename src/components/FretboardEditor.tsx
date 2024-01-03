import { DEFAULT_DIAGRAM, DEFAULT_FRETBOARD_SETTINGS } from "../constants";
import Fretboard, {
  FretboardDiagram,
  FretboardDiagramDot,
  FretboardSettings,
  LabelingSettings,
  type FretboardLocation,
} from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

import { Interval, Note } from "tonal";

export default function FretboardEditor() {
  const settings = DEFAULT_FRETBOARD_SETTINGS;
  const diagram = DEFAULT_DIAGRAM;

  return (
    <div className="fretboard-editor mx-auto flex max-w-lg">
      <div className="flex-grow">
        <Fretboard settings={settings} diagram={diagram} />
      </div>
      <div className="flex-grow-0 pl-3 pr-1">
        <FretboardControls />
      </div>
      <FretboardSettingsForm />
    </div>
  );
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

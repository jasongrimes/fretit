import Fretboard, {
  FretboardSettingsData,
  type FretboardLocation,
} from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettings from "./FretboardSettings";

import { Interval, Note } from "tonal";

export default function FretboardEditor() {
  const settings = fretboardData.settings;

  return (
    <div className="fretboard-editor mx-auto max-w-96">
      <Fretboard settings={settings} diagram={fretboardData.diagrams[0]} />
      <FretboardControls />
      <FretboardSettings />
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
    preferSharps: false,
  },
  diagrams: [
    {
      uid: "abc123",
      name: "C",
      longName: "C major",
      sortOrder: 0,
      overlays: undefined,
      stops: [
        { location: [5, 3] as FretboardLocation, label: "C" },
        { location: [4, 2] as FretboardLocation, label: "E" },
        { location: [3, 0] as FretboardLocation, label: "G" },
        { location: [2, 1] as FretboardLocation, label: "C" },
      ],
    },
  ],
};

/*
function setOverlayLabels(
  overlays: FretboardDiagramOverlays,
  settings: FretboardSettingsData,
): FretboardDiagramOverlays {
  const scheme = overlays.autolabel ?? "pitch";
  const dots = overlays.dots.map((dot) => {
    if (dot.customLabel) {
      return { ...dot, label: dot.customLabel };
    } else {
      return {
        ...dot,
        label: getLocationLabel(
          dot.location,
          settings,
          scheme,
          overlays.intervalRef,
        ),
      };
    }
  });
  return {
    ...overlays,
    dots: dots,
  };
}

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
  settings: FretboardSettingsData,
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
  settings: FretboardSettingsData,
  scheme: "pitch" | "pitchClass" | "chordInterval" | "scaleInterval" = "pitch",
  ref: FretboardLocation = [6, 0],
) {
  const pitch = getLocationPitch(location, settings);

  switch (scheme) {
    case "pitch":
      return pitch;
    case "pitchClass":
      return Note.pitchClass(pitch);
    case "chordInterval":
    case "scaleInterval": {
      const pitchMidi = Note.midi(pitch) ?? 0;
      const refMidi = Note.midi(getLocationPitch(ref, settings)) ?? 0;
      const semitones = pitchMidi - refMidi;
      console.log(refMidi, pitchMidi, semitones);
      const interval = Interval.get(Interval.fromSemitones(semitones));
      // prettier-ignore
      let intervalName = `${interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : "" }${interval.simple === 8 ? 1 : interval.simple}`;
      if (scheme === "chordInterval" && intervalName === "1") {
        intervalName = "R";
      }
      return intervalName;
    }
  }
}

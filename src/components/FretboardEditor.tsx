import Fretboard from "./Fretboard";
import String from "./String";
import StringMuteControl from "./StringMuteControl";
import FretNote from "./FretNote";
import FretNoteDot from "./FretNoteDot";
import FretMarker from "./FretMarker";
import FretboardControls from "./FretboardControls";
import FretboardSettings from "./FretboardSettings";

export default function FretboardEditor() {
  return (
    <div className="fretboard-editor">
      <Fretboard>
        <String stringNum="1">
          <StringMuteControl />
          <FretNote fretNum="0">
            <FretNoteDot>E</FretNoteDot>
          </FretNote>
          <FretNote fretNum="1" />
          <FretNote fretNum="2" />
          <FretNote fretNum="3">
            <FretMarker />
          </FretNote>
        </String>
      </Fretboard>
      <FretboardControls />
      <FretboardSettings />
    </div>
  );
}

const fretboardData = {
  uid: "xY32ch",
  name: null,
  createdAt: null,
  settings: {
    tuning: { 6: "E2", 5: "A2", 4: "D3", 3: "G3", 2: "B3", 1: "E4" },
    numFrets: 12,
    isMovable: false,
    lowestFret: 0,
    fretMarkers: {
      single: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
      double: [12, 24],
    },
  },
  diagrams: [
    {
      uid: "abc123",
      name: "C",
      longName: "C major",
      sortOrder: 0,
      overlays: {},
      stops: {
        dots: [
          [5, 3],
          [4, 2],
          [3, 0],
          [2, 1],
        ],
        autoLabel: "pitch",
        intervalRef: [5, 3],
      },
    },
  ],
};

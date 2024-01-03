import type {
  FretboardDiagram,
  FretboardDiagramDot,
  FretboardSettings,
} from "../lib/fretboard";
import {
  findDotByString,
  getLocationLabel,
  removeDotByLocation,
} from "../lib/fretboard";
import "./Fretboard.css";

//
// Fretboard component
//
interface FretboardProps {
  settings: FretboardSettings;
  diagram: FretboardDiagram;
  onSetDiagram: (diagram: FretboardDiagram) => void;
}
export default function Fretboard({
  settings,
  diagram,
  onSetDiagram,
}: FretboardProps) {
  const numStrings = settings.tuning.length;

  function handleSetStop(stringNum: number, fretNum: number) {
    const label = getLocationLabel(
      [stringNum, fretNum],
      settings,
      diagram.labeling,
    );
    
    const newDot = {
      location: [stringNum, fretNum],
      label: label,
    } as FretboardDiagramDot;
    
    const newStops = diagram.stops.filter((dot) => dot.location[0] !== stringNum);
    newStops.push(newDot);
    onSetDiagram({...diagram, stops: newStops});
  }

  const strings = settings.tuning.map((pitch, stringIndex) => {
    const stringNum = stringIndex + 1;
    return (
      <String
        key={stringNum}
        settings={settings}
        stringNum={stringNum}
        stopDot={findDotByString(diagram?.stops, stringNum)}
        onSetStop={handleSetStop}
      />
    );
  });

  return (
    <div
      className="fretboard"
      style={{ "--num-strings": numStrings } as React.CSSProperties}
    >
      {strings}
    </div>
  );
}

//
// <String> component
//
interface StringProps {
  settings: FretboardSettings;
  stringNum: number;
  stopDot?: FretboardDiagramDot;
  onSetStop: (stringNum: number, fretNum: number) => void;
}
function String({ settings, stringNum, stopDot, onSetStop }: StringProps) {
  const isMuted = stopDot === undefined;

  function handleClickFretNote(fretNum: number) {
    if (stopDot?.location[1] !== fretNum) {
      onSetStop(stringNum, fretNum);
    } else {
      console.log(`Fret ${fretNum} is already stopped.`);
    }
  }

  // Assemble <FretNote> list
  const fretNotes = [];
  for (let fretNum = 0; fretNum <= settings.numFrets; fretNum++) {
    // Add <FretMarker> on first string
    let fretMarker;
    if (stringNum === 1 && settings.fretMarkers?.includes(fretNum)) {
      fretMarker = (
        <FretMarker
          double={!!settings.doubleFretMarkers?.includes(fretNum)}
          fretNum={fretNum}
        />
      );
    }

    // Add <FretNoteDot>
    let fretNoteDot;
    if (stopDot?.location[1] === fretNum) {
      fretNoteDot = <FretNoteDot label={stopDot.label} />;
    }

    // Add <FretNote>
    fretNotes.push(
      <FretNote
        key={stringNum + "," + fretNum}
        onClick={() => handleClickFretNote(fretNum)}
      >
        {fretMarker}
        {fretNoteDot}
      </FretNote>,
    );
  }

  return (
    <div className={`string ${isMuted ? "muted" : ""}`}>
      <StringMuteControl isMuted={isMuted} />
      {fretNotes}
    </div>
  );
}

//
// <StringMuteControl>
//
interface StringMuteControlProps {
  isMuted: boolean;
}
function StringMuteControl({ isMuted }: StringMuteControlProps) {
  return (
    <div className="flex h-[30px] flex-shrink-0 flex-grow-0 flex-col items-center justify-center bg-gray-950">
      {isMuted ? (
        <span className="absolute top-[60px] z-[2] font-bold text-gray-700">
          x
        </span>
      ) : (
        <button className="btn btn-square btn-outline btn-primary btn-sm absolute z-10 bg-gray-950">
          x
        </button>
      )}
    </div>
  );
}

//
// <FretMarker>
//
interface FretMarkerProps {
  double: boolean;
  fretNum: number;
}
function FretMarker({ double, fretNum }: FretMarkerProps) {
  return (
    <div
      className={double ? "double-fretmark" : "single-fretmark"}
      data-fret-num={fretNum}
    ></div>
  );
}

//
// <FretNote>
//
interface FretNoteProps {
  children?: React.ReactNode;
  onClick: () => void;
}
function FretNote({ children, onClick }: FretNoteProps) {
  return (
    <div className="fret-note" onClick={onClick}>
      {children}
    </div>
  );
}

//
// <FretNoteDot>
//
function FretNoteDot({ label = "" }: { label?: string }) {
  return (
    <div className="fret-note-dot opacity-1 absolute bottom-0 z-10 flex size-8 items-center justify-center rounded-full bg-accent text-accent-content">
      {label}
    </div>
  );
}

//
// Helper functions
//

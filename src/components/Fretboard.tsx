import type {
  FretboardDiagram,
  FretboardDiagramDot,
  FretboardSettings,
} from "../lib/fretboard";
import { filterDotsByFret, filterDotsByString } from "../lib/fretboard";
import "./Fretboard.css";

//
// Fretboard component
//
interface FretboardProps {
  settings: FretboardSettings;
  diagram?: FretboardDiagram;
}
export default function Fretboard({ settings, diagram }: FretboardProps) {
  const numStrings = settings.tuning.length;

  const strings = settings.tuning.map((pitch, stringIndex) => {
    const stringNum = stringIndex + 1;
    return (
      <String
        key={stringNum}
        settings={settings}
        stringNum={stringNum}
        stopDots={filterDotsByString(stringNum, diagram?.stops)}
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
  stopDots: FretboardDiagramDot[];
}
function String({ settings, stringNum, stopDots = [] }: StringProps) {
  const isMuted = stopDots.length === 0;
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
    const fretStopDots = filterDotsByFret(fretNum, stopDots);
    if (fretStopDots.length) {
      fretNoteDot = <FretNoteDot label={fretStopDots[0].label} />;
    }

    // Add <FretNote>
    fretNotes.push(
      <FretNote key={stringNum + "," + fretNum}>
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
}
function FretNote({ children }: FretNoteProps) {
  return <div className="fret-note">{children}</div>;
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

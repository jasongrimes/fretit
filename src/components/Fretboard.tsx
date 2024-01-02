import "./Fretboard.css";

export interface FretboardSettingsData {
  tuning: string[];
  numFrets: number;
  preferSharps: boolean;
  isMovable?: boolean;
  lowestFret?: number;
  fretMarkers?: number[];
  doubleFretMarkers?: number[];
}

export interface FretboardDiagram {
  uid?: string;
  name?: string;
  longName?: string;
  overlays?: FretboardDiagramDot[];
  stops?: FretboardDiagramDot[];
}

/*
export interface FretboardDiagramOverlays {
  dots: FretboardDiagramDot[];
  // autolabel?: "scaleInterval" | "chordInterval" | "pitch" | "pitchClass";
  // intervalRef?: FretboardLocation;
}
*/

export interface FretboardDiagramDot {
  location: FretboardLocation;
  label: string;
  noAutoLabel?: boolean;
  customStyle?: string;
}

export type FretboardLocation = [stringNum: number, fretNum: number];

//
// Fretboard component
//
interface FretboardProps {
  settings: FretboardSettingsData;
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
  settings: FretboardSettingsData;
  stringNum: number;
  stopDots: FretboardDiagramDot[];
}
function String({ settings, stringNum, stopDots = [] }: StringProps) {
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
    <div className="string">
      <StringMuteControl />
      {fretNotes}
    </div>
  );
}

//
// <StringMuteControl>
//
function StringMuteControl() {
  return <div className="string-mute-control"></div>;
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
function filterDotsByString(
  stringNum: number,
  dots: FretboardDiagramDot[] = [],
): FretboardDiagramDot[] {
  return dots.filter((dot) => dot.location[0] === stringNum);
}

function filterDotsByFret(
  fretNum: number,
  dots: FretboardDiagramDot[] = [],
): FretboardDiagramDot[] {
  return dots.filter((dot) => dot.location[1] === fretNum);
}

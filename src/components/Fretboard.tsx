import {
  FretboardDiagram,
  FretboardLabeler,
  FretboardSettings,
  LabelerSettings,
} from "../services/fretboard";
import "./Fretboard.css";

//
// Fretboard component
//
interface FretboardProps {
  settings: FretboardSettings;
  labelerSettings: LabelerSettings;
  diagram: FretboardDiagram;
  onSetVoicing: (voicing: number[]) => void;
  handlePluck: (stringNum: number, fretNum: number) => void;
  stringNodes: Map<number, HTMLElement>;
}
export default function Fretboard({
  settings,
  labelerSettings,
  diagram,
  onSetVoicing, // TODO: rename to setVoicing
  handlePluck,
  stringNodes,
}: FretboardProps) {
  const numStrings = settings.tuning.length;

  const labeler = new FretboardLabeler(settings.tuning, labelerSettings);

  function handleStopString(stringNum: number, fretNum: number) {
    const newVoicing = diagram.voicing;
    newVoicing[stringNum - 1] = fretNum ?? -1;
    onSetVoicing(newVoicing);
    handlePluck(stringNum, fretNum);
  }

  //
  // Assemble <String>
  //
  const strings = diagram.voicing.map((fretNum, stringIndex) => {
    const stringNum = stringIndex + 1;
    return (
      <String
        key={stringNum}
        settings={settings}
        stringNum={stringNum}
        stoppedFret={fretNum}
        handleStopFret={(fretNum: number) => {
          handleStopString(stringNum, fretNum);
        }}
        labeler={labeler}
        stringNodes={stringNodes}
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
  stoppedFret: number;
  handleStopFret: (fretNum: number) => void;
  labeler: FretboardLabeler;
  stringNodes: Map<number, HTMLElement>;
}
function String({
  settings,
  stringNum,
  stoppedFret,
  handleStopFret,
  labeler,
  stringNodes,
}: StringProps) {
  const isMuted = stoppedFret < 0;

  function handleClickFret(fretNum: number) {
    handleStopFret(fretNum);
  }

  function handleClickMute() {
    handleStopFret(-1);
  }

  // Assemble <FretNote> list
  const fretNotes = [];
  for (
    let fretNum = settings.lowestFret;
    fretNum <= settings.highestFret;
    fretNum++
  ) {
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
    const label = labeler.getLocationLabel([stringNum, fretNum]);
    let fretNoteDot;
    if (stoppedFret === fretNum) {
      fretNoteDot = <FretNoteDot label={label} />;
    }

    // Add <FretNote>
    fretNotes.push(
      <FretNote
        key={stringNum + "," + fretNum}
        onClick={() => handleClickFret(fretNum)}
      >
        {fretMarker}
        {fretNoteDot}
      </FretNote>,
    );
  }

  return (
    <div
      className={`string ${isMuted ? "muted" : ""}`}
      ref={(node) => {
        if (node) {
          stringNodes.set(stringNum, node);
        } else {
          stringNodes.delete(stringNum);
        }
      }}
    >
      <StringMuteControl isMuted={isMuted} onClick={handleClickMute} />
      {fretNotes}
    </div>
  );
}

//
// <StringMuteControl>
//
interface StringMuteControlProps {
  isMuted: boolean;
  onClick: () => void;
}
function StringMuteControl({ isMuted, onClick }: StringMuteControlProps) {
  return (
    <div className="flex h-[30px] flex-shrink-0 flex-grow-0 flex-col items-center justify-center bg-gray-950">
      {isMuted ? (
        <span className="absolute top-[60px] z-[2] font-bold text-gray-700">
          x
        </span>
      ) : (
        <button
          onClick={onClick}
          className="btn btn-square btn-outline btn-primary btn-sm absolute z-10 mt-px bg-gray-950"
        >
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

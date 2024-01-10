import { PointerEvent } from "react";
import {
  ChordGrip,
  FretboardSettings,
  FretboardLabeler,
  Instrument,
  FretboardLocation,
} from "../services/fretboard";
import "./Fretboard.css";

//
// <Fretboard> component
//
interface FretboardProps {
  settings: FretboardSettings;
  instrument: Instrument;
  labeler: FretboardLabeler;
  grip: ChordGrip;
  setStringStop: (location: FretboardLocation) => void;
  playLocation: (location: FretboardLocation) => void;
  stringNodes: Map<number, HTMLElement>;
}
export default function Fretboard({
  settings,
  instrument,
  labeler,
  grip,
  setStringStop,
  playLocation,
  stringNodes,
}: FretboardProps) {
  const numStrings = instrument.tuning.length;

  function handleStopString(stringNum: number, fretNum: number) {
    setStringStop([stringNum, fretNum]);
    playLocation([stringNum, fretNum]);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // @ts-expect-error React PointerEvent doesn't support releasePointerCapture yet.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    event.target.releasePointerCapture(event.pointerId);
  }

  //
  // Assemble <String>
  //
  const strings = grip.voicing.map((stoppedFret, stringIndex) => {
    const stringNum = stringIndex + 1;
    return (
      <String
        key={stringNum}
        settings={settings}
        instrument={instrument}
        stringNum={stringNum}
        stoppedFret={stoppedFret}
        onStopFret={(fretNum: number) => {
          handleStopString(stringNum, fretNum);
        }}
        labeler={labeler}
        stringNodes={stringNodes}
        onPlayString={() => playLocation([stringNum, stoppedFret])}
      />
    );
  });

  return (
    <div
      className="fretboard"
      style={{ "--num-strings": numStrings } as React.CSSProperties}
      onPointerDown={handlePointerDown}
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
  instrument: Instrument;
  stringNum: number;
  stoppedFret: number;
  onStopFret: (fretNum: number) => void;
  labeler: FretboardLabeler;
  stringNodes: Map<number, HTMLElement>;
  onPlayString: () => void;
}
function String({
  settings,
  instrument,
  stringNum,
  stoppedFret,
  onStopFret,
  labeler,
  stringNodes,
  onPlayString,
}: StringProps) {
  const isMuted = stoppedFret < 0;

  // Prevent double "plucks" when clicking on a fret.
  // Track when pointer is initially pressed down on this string,
  // so we can ignore the pointerleave event in that case.
  let pointerPressed = false;
  function handlePointerDown() {
    pointerPressed = true;
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    // event.pressure doesn't work in ios safari.
    if (
      !pointerPressed &&
      (event.pressure > 0 || event.pointerType === "touch")
    ) {
      onPlayString();
    }
    pointerPressed = false;
  }

  function handleClickFret(fretNum: number) {
    onStopFret(fretNum);
    pointerPressed = false;
  }

  function handleClickMute() {
    onStopFret(-1);
    pointerPressed = false;
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
    if (stringNum === 1 && instrument.fretMarkers?.includes(fretNum)) {
      fretMarker = (
        <FretMarker
          double={!!instrument.doubleFretMarkers?.includes(fretNum)}
          fretNum={fretNum}
        />
      );
    }

    // Add <FretNoteDot>
    let fretNoteDot;
    if (stoppedFret === fretNum) {
      const label = labeler.getLocationLabel([stringNum, fretNum]);
      const style = labeler.getLocationStyle([stringNum, fretNum]);
      fretNoteDot = <FretNoteDot label={label} style={style} />;
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

  // Render <String>
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
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
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
function FretNoteDot({
  label = "",
  style,
}: {
  label?: string;
  style?: string;
}) {
  const extraClasses =
    style === "root"
      ? "bg-primary text-primary-content"
      : "bg-accent text-accent-content";
  return (
    <div
      className={`fret-note-dot opacity-1 absolute bottom-0 z-10 flex size-8 items-center justify-center rounded-full ${extraClasses}`}
    >
      {label}
    </div>
  );
}

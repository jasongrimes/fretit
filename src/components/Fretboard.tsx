import { PointerEvent, useRef } from "react";
import {
  FretboardLabeler,
  FretboardLocation,
  FretboardSettings,
  Instrument,
} from "../services/fretboard";
import "./Fretboard.css";

//
// <Fretboard> component
//
interface FretboardProps {
  settings: FretboardSettings;
  instrument: Instrument;
  labeler: FretboardLabeler;
  setStringStop: (location: FretboardLocation) => void;
  playLocation: (location: FretboardLocation) => void;
  stringNodes: Map<number, HTMLElement>;
  voicing: number[];
  overlays: Record<number, string>[];
}
export default function Fretboard({
  settings,
  instrument,
  labeler,
  setStringStop,
  playLocation,
  stringNodes,
  voicing,
  overlays = [],
}: FretboardProps) {
  const numStrings = instrument.tuning.length;
  console.log("overlays", overlays);

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
  const strings = voicing.map((stoppedFret, stringIndex) => {
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
        overlays={overlays[stringIndex]}
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
  overlays: Record<string, string>;
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
  overlays = {},
}: StringProps) {
  const isMuted = stoppedFret < 0;

  const timerRef = useRef<number | null>(null);
  const handledPress = useRef(false);

  function startPressTimer() {
    handledPress.current = false;
    timerRef.current = setTimeout(() => {
      onStopFret(-1);
      timerRef.current = null;
      handledPress.current = true;
    }, 500);
  }
  function clearPressTimer() {
    timerRef.current && clearTimeout(timerRef.current);
  }

  // Prevent double "plucks" when clicking on a fret.
  // Track when pointer is initially pressed down on this string,
  // so we can ignore the pointerleave event in that case.
  let pointerPressed = false;
  function handlePointerDown() {
    pointerPressed = true;
    startPressTimer();
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
    clearPressTimer();
  }

  function handleClickFret(fretNum: number) {
    if (!handledPress.current) {
      // Ignore if we already handled a long-press
      onStopFret(fretNum);
      pointerPressed = false;
      clearPressTimer();
    }
  }

  function handlePointerUp() {
    clearPressTimer();
  }

  /*
  function handleClickMute() {
    onStopFret(-1);
    pointerPressed = false;
  }
  */

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
    } else if (overlays[fretNum]) {
      fretNoteDot = <FretNoteOverlay label={overlays[fretNum].label} styleString={overlays[fretNum].style} />;
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
      onPointerUp={handlePointerUp}
    >
      {fretNotes}
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

//
// <FretNoteDot>
//
function FretNoteOverlay({
  label,
  styleString = "",
}: {
  label?: string;
  styleString: string;
}) {
  const styles = styleString.split(" ");
  let extraClasses = "";
  if (styles.includes("chord-tone")) {
    extraClasses += " opacity-1 bg-accent text-accent-content";
  }
  if (styles.includes("chord-root")) {
    extraClasses += " opacity-1 bg-primary text-primary-content";
  }
  if (styles.includes("opaque")) {
    extraClasses += " opacity-50";
  }
  return (
    <div
      className={`fret-note-dot absolute bottom-0 z-10 flex size-8 items-center justify-center rounded-full text-black opacity-60 ${extraClasses}`}
    >
      {label}
    </div>
  );
}

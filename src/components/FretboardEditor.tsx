import { useState, useRef } from "react";
import useSound from "../hooks/use-sound.hook";
import {
  DEFAULT_DIAGRAM,
  DEFAULT_FRETBOARD_SETTINGS,
  DEFAULT_LABELER_SETTINGS,
} from "../services/fretboard";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

export default function FretboardEditor() {
  const [fretboardSettings, setFretboardSettings] = useState(
    DEFAULT_FRETBOARD_SETTINGS,
  );
  const [labelerSettings, setLabelerSettings] = useState(
    DEFAULT_LABELER_SETTINGS,
  );
  const [diagram, setDiagram] = useState(DEFAULT_DIAGRAM);
  const [muted, setMuted] = useState(false);

/*
  const [stringsSounding, setStringsSounding] = useState<Record<number, number>>({});
  const [soundingStrings, setSoundingStrings] = useState<number[]>([]);
  const soundingStringsRef = useRef<number[]>([]);
  const stringSoundingTimeoutsRef = useRef<Record<number, number>>({});
  */

  function setStringSounding(stringNum: number, sounding: boolean) {
    /*
    console.log("setStringSounding", stringNum, sounding);
    // Clear any existing timeouts
    if (stringSoundingTimeoutsRef.current[stringNum]) {
      clearTimeout(stringSoundingTimeoutsRef.current[stringNum]);
    }
    if (sounding) {
      // Add to the list of currently sounding strings
      if (!soundingStringsRef.current.includes(stringNum)) {
        soundingStringsRef.current.push(stringNum);
      }
      // Set a timeout to remove it from the list of sounding strings
      stringSoundingTimeoutsRef.current[stringNum] = setTimeout(() => setStringSounding(stringNum, false), 2000);
    } else {
      // Remove it from the list of sounding strings
      soundingStringsRef.current = soundingStringsRef.current.filter((val) => val !== stringNum);
      delete stringSoundingTimeoutsRef.current[stringNum];
    }
    setSoundingStrings([...soundingStringsRef.current]);
    console.log("soundingStrings", soundingStringsRef.current);
    console.log("stringSoundingTimeouts", stringSoundingTimeoutsRef.current);
    */
  }

  const { play, strum } = useSound({
    tuning: fretboardSettings.tuning,
    muted: muted,
//    setStringSounding
  });

  function setVoicing(voicing: number[]) {
    setDiagram({ ...diagram, voicing });
  }

  function handleStrum() {
    strum(diagram.voicing);
  }

  function handlePluck(stringNum: number, fretNum: number) {
    play(stringNum, fretNum);
  }

  function handleSetMuted(muted: boolean) {
    // if (muted) {
    //   setSoundingStrings([]);
    // }
    setMuted(muted);
  }

  return (
    <div className="fretboard-editor mx-auto flex max-w-lg">
      <div className="flex-grow">
        <Fretboard
          settings={fretboardSettings}
          labelerSettings={labelerSettings}
          diagram={diagram}
          onSetVoicing={setVoicing}
          handlePluck={handlePluck}
        />
      </div>
      <div className="flex-grow-0 pl-3 pr-1">
        <FretboardControls
          onStrum={() => handleStrum()}
          muted={muted}
          onSetMuted={handleSetMuted}
        />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

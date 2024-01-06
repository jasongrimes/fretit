import { useRef, useState } from "react";
import useSound from "../hooks/use-sound.hook";
import {
  DEFAULT_DIAGRAM,
  DEFAULT_FRETBOARD_SETTINGS,
  DEFAULT_LABELER_SETTINGS,
} from "../services/fretboard";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

const animationEnabled = true;

export default function FretboardEditor() {
  const [fretboardSettings, setFretboardSettings] = useState(
    DEFAULT_FRETBOARD_SETTINGS,
  );
  const [labelerSettings, setLabelerSettings] = useState(
    DEFAULT_LABELER_SETTINGS,
  );
  const [diagram, setDiagram] = useState(DEFAULT_DIAGRAM);
  const [muted, setMuted] = useState(false);
  const stringsRef = useRef<Map<number, HTMLElement>|null>(null);

  function getStringNodes() {
    if (!stringsRef.current) {
      stringsRef.current = new Map<number, HTMLElement>();
    }
    return stringsRef.current;
  }

  // Animation when playing a string.
  function onPlayString(stringNum: number) {
    if (animationEnabled) {
      const node = getStringNodes().get(stringNum);
      if (node?.classList.contains("plucked")) {
        node?.classList.remove("plucked");
        void node?.offsetHeight; // Hack to force DOM reflow so we can restart the animation.
      }
      node?.classList.add("plucked");
    }
  }

  const { play, strum } = useSound({
    tuning: fretboardSettings.tuning,
    muted: muted,
    onPlayString
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
          stringNodes={getStringNodes()}
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

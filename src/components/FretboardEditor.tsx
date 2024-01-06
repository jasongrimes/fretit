import { useState } from "react";
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

  const { play, strum } = useSound({
    tuning: fretboardSettings.tuning,
    muted: muted,
  });

  function setVoicing(voicing: number[]) {
    setDiagram({ ...diagram, voicing });
  }

  function handleStrum() {
    strum(diagram.voicing);
  }

  return (
    <div className="fretboard-editor mx-auto flex max-w-lg">
      <div className="flex-grow">
        <Fretboard
          settings={fretboardSettings}
          labelerSettings={labelerSettings}
          diagram={diagram}
          onSetVoicing={setVoicing}
          onPlay={play}
        />
      </div>
      <div className="flex-grow-0 pl-3 pr-1">
        <FretboardControls
          onStrum={() => handleStrum()}
          muted={muted}
          setMuted={setMuted}
        />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

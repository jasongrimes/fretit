import { useState } from "react";
import { Note } from "tonal";
import { DEFAULT_DIAGRAM, DEFAULT_FRETBOARD_SETTINGS } from "../constants";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";
import useSound from "../hooks/use-sound.hook";

export default function FretboardEditor() {  
  const [settings, setSettings] = useState(DEFAULT_FRETBOARD_SETTINGS);
  const [diagram, setDiagram] = useState(DEFAULT_DIAGRAM);

  const tuning = settings.tuning.map((pitch) => Note.midi(pitch) ?? 0);
  const { play, strum } = useSound({ tuning });
  
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
          settings={settings}
          diagram={diagram}
          onSetVoicing={setVoicing}
          onPlay={play}
        />
      </div>
      <div className="flex-grow-0 pl-3 pr-1">
        <FretboardControls onStrum={() => handleStrum()} />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

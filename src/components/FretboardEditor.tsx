import { useState } from "react";
import { DEFAULT_DIAGRAM, DEFAULT_FRETBOARD_SETTINGS } from "../constants";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

export default function FretboardEditor() {
  const settings = DEFAULT_FRETBOARD_SETTINGS;
  const initialDiagram = DEFAULT_DIAGRAM;

  const [diagram, setDiagram] = useState(initialDiagram);

  return (
    <div className="fretboard-editor mx-auto flex max-w-lg">
      <div className="flex-grow">
        <Fretboard settings={settings} diagram={diagram} />
      </div>
      <div className="flex-grow-0 pl-3 pr-1">
        <FretboardControls />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

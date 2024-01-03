import { useState } from "react";
import { DEFAULT_DIAGRAM, DEFAULT_FRETBOARD_SETTINGS } from "../constants";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";
import type { FretboardDiagram } from "../lib/fretboard";
import { updateDiagramLabels } from "../lib/fretboard";

export default function FretboardEditor() {
  const settings = DEFAULT_FRETBOARD_SETTINGS;
  const initialDiagram = updateDiagramLabels(DEFAULT_DIAGRAM, settings);

  const [diagram, setDiagram] = useState(initialDiagram);

  function handleSetDiagram(diagram: FretboardDiagram) {
    setDiagram(diagram);
  }

  return (
    <div className="fretboard-editor mx-auto flex max-w-lg">
      <div className="flex-grow">
        <Fretboard settings={settings} diagram={diagram} onSetDiagram={handleSetDiagram} />
      </div>
      <div className="flex-grow-0 pl-3 pr-1">
        <FretboardControls />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

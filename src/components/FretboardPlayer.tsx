import { useRef, useState } from "react";
import useSound from "../hooks/use-sound.hook";
import {
  DEFAULT_GRIPS,
  DEFAULT_FRETBOARD_SETTINGS,
  DEFAULT_LABELER_SETTINGS,
  LabelingScheme,
} from "../services/fretboard";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

const animationEnabled = true;

export default function FretboardPlayer() {
  const [fretboardSettings /*, setFretboardSettings*/] = useState(
    DEFAULT_FRETBOARD_SETTINGS,
  );
  const [labelerSettings, setLabelerSettings] = useState(
    DEFAULT_LABELER_SETTINGS,
  );
  const grips = DEFAULT_GRIPS;
  // const [diagram, setDiagram] = useState(DEFAULT_DIAGRAM);
  const emptyGrip = { name: "", voicing: fretboardSettings.tuning.map(() => -1) };
  const [grip, setGrip] = useState(grips[0] ?? emptyGrip);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const stringsRef = useRef<Map<number, HTMLElement> | null>(null);

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

  const { play, strum, muteAll } = useSound({
    tuning: fretboardSettings.tuning,
    muted: !soundEnabled,
    onPlayString,
  });

  function setVoicing(voicing: number[]) {
    setGrip({ ...emptyGrip, voicing });
  }

  function handleSetGrip(gripName: string) {
    const grip = grips.find((grip) => grip.name === gripName) ?? emptyGrip;
    setGrip(grip);
    strum(grip.voicing);
  }

  function handleMuteAllStrings() {
    setGrip({ ...grip, voicing: fretboardSettings.tuning.map(() => -1) });
    muteAll();
  }

  function handleStrum() {
    strum(grip.voicing);
  }

  function handlePluck(stringNum: number, fretNum: number) {
    play(stringNum, fretNum);
  }

  function handleSetSoundEnabled(enabled: boolean) {
    setSoundEnabled(enabled);
  }

  function handleSetLabelingScheme(scheme: LabelingScheme) {
    setLabelerSettings({ ...labelerSettings, scheme });
  }

  return (
    <div className="fretboard-player mx-auto flex max-w-lg  overflow-x-hidden">
      <div className="flex-grow">
        <Fretboard
          settings={fretboardSettings}
          labelerSettings={labelerSettings}
          grip={grip}
          onSetVoicing={setVoicing}
          handlePluck={handlePluck}
          stringNodes={getStringNodes()}
        />
      </div>
      <div className="flex-grow-0 pl-2 pr-1">
        <FretboardControls
          onStrum={() => handleStrum()}
          soundEnabled={soundEnabled}
          onSetSoundEnabled={handleSetSoundEnabled}
          labelerSettings={labelerSettings}
          onSetLabelingScheme={handleSetLabelingScheme}
          onMuteAllStrings={handleMuteAllStrings}
          grips={DEFAULT_GRIPS}
          onSetGrip={handleSetGrip}
        />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

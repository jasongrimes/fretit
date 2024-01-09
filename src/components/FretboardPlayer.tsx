import { useRef, useState } from "react";
import useSound from "../hooks/use-sound.hook";
import {
  ChordGrip,
  DEFAULT_DIAGRAM_SETTINGS,
  DEFAULT_GRIPS,
  DiagramSettings,
  FretboardLabeler,
  INSTRUMENTS,
  LabelingScheme,
} from "../services/fretboard";
import Fretboard from "./Fretboard";
import FretboardControls from "./FretboardControls";
import FretboardSettingsForm from "./FretboardSettingsForm";

const animationEnabled = true;

export default function FretboardPlayer() {
  const [settings, setSettings] = useState<DiagramSettings>(
    DEFAULT_DIAGRAM_SETTINGS,
  );
  const instrument = INSTRUMENTS[settings.instrument];
  const grips = DEFAULT_GRIPS;
  const emptyGrip: ChordGrip = {
    name: "",
    voicing: instrument.tuning.map(() => -1),
  };
  const [currentGrip, setCurrentGrip] = useState(grips[0] ?? emptyGrip);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const labeler = new FretboardLabeler({
    tuning: instrument.tuning,
    labelingScheme: settings.labeling,
    tonic: settings.tonic,
    root: currentGrip.root,
    preferSharps: settings.preferSharps,
  });

  //
  // Support string animation when playing
  //
  const stringsRef = useRef<Map<number, HTMLElement> | null>(null);
  function getStringNodes() {
    if (!stringsRef.current) {
      stringsRef.current = new Map<number, HTMLElement>();
    }
    return stringsRef.current;
  }
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

  //
  // Sound player
  //
  const { play, strum, muteAll } = useSound({
    tuning: instrument.tuning,
    muted: !soundEnabled,
    onPlayString,
  });

  //
  // Event handlers
  //
  function setVoicing(voicing: number[]) {
    setCurrentGrip({ ...currentGrip, voicing });
  }

  function handleSetGrip(gripName: string) {
    const grip = grips.find((grip) => grip.name === gripName);
    if (grip) {
      setCurrentGrip({ ...grip });
      strum(grip.voicing);
    }
  }

  function handleMuteAllStrings() {
    setCurrentGrip({ ...currentGrip, voicing: emptyGrip.voicing });
    muteAll();
  }

  function handleStrum() {
    strum(currentGrip.voicing);
  }

  function handlePluck(stringNum: number, fretNum: number) {
    play(stringNum, fretNum);
  }

  function handleSetSoundEnabled(enabled: boolean) {
    setSoundEnabled(enabled);
  }

  function handleSetLabelingScheme(scheme: LabelingScheme) {
    setSettings({ ...settings, labeling: scheme });
  }

  return (
    <div className="fretboard-player mx-auto flex max-w-lg  overflow-x-hidden">
      <div className="flex-grow">
        <Fretboard
          settings={settings}
          instrument={instrument}
          labeler={labeler}
          grip={currentGrip}
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
          labeler={labeler}
          onSetLabelingScheme={handleSetLabelingScheme}
          onMuteAllStrings={handleMuteAllStrings}
          grips={DEFAULT_GRIPS}
          onSetGrip={handleSetGrip}
          currentGrip={currentGrip}
        />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

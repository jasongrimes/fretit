import { useRef, useState } from "react";
import { INSTRUMENTS } from "../data/instruments";
import useSound from "../hooks/use-sound.hook";
import { ChordCalculator } from "../services/chord-calculator";
import {
  FretboardLabeler,
  FretboardLocation,
  FretboardSettings,
  LabelingScheme,
} from "../services/fretboard";
import Fretboard from "./Fretboard";
import FretboardSettingsForm from "./FretboardSettingsForm";
import PositionPlayerControls from "./PositionPlayerControls";

const animationEnabled = true;

const DEFAULT_SETTINGS: FretboardSettings = {
  instrument: "Guitar",
  lowestFret: 0,
  highestFret: 15,
  tonic: "C",
  labeling: "scaleInterval",
  preferSharps: false,
};

export default function PositionPlayer() {
  const [settings, setSettings] = useState<FretboardSettings>(DEFAULT_SETTINGS);
  const instrument = INSTRUMENTS[settings.instrument];

  const keyTonic = "C";
  const keyType = "major";
  const chordCalculator = new ChordCalculator({ keyTonic, keyType });

  const [cagedPosition, setCagedPosition] = useState("C"); // TODO: Default to lowest caged position for this key
  const [chordNum, setChordNum] = useState("I");

  //const positions = C_MAJOR_POSITIONS;
  //const positionNum = positions[cagedPosition].position;
  // const chordVoicings = positions[cagedPosition].chords;
  //const voicing = chordVoicings[chordNum];
  const voicing = chordCalculator.getChordVoicing(cagedPosition, chordNum);
  const chordList = chordCalculator.getChordList();
  const positionList = chordCalculator.getPositionList();
  const currentPositionIdx = positionList.findIndex(
    (position) => position.caged === cagedPosition,
  );
  console.log("positionList", positionList);
  console.log("currentPosition", currentPositionIdx);

  // const [currentGrip, setCurrentGrip] = useState(grips[positionShape]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const labeler = new FretboardLabeler({
    tuning: instrument.tuning,
    labelingScheme: settings.labeling,
    tonic: settings.tonic,
    root: chordCalculator.getChordRoot(chordNum),
    preferSharps: settings.preferSharps,
  });

  //
  // Support string animation
  //
  const stringsRef = useRef<Map<number, HTMLElement> | null>(null);
  function getStringNodes() {
    if (!stringsRef.current) {
      stringsRef.current = new Map<number, HTMLElement>();
    }
    return stringsRef.current;
  }
  function playString(stringNum: number) {
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
  const { play, strum } = useSound({
    tuning: instrument.tuning,
    muted: !soundEnabled,
    onPlayString: playString,
  });

  //
  // Callbacks
  //
  function handleSetChordNum(chordNum: string) {
    setChordNum(chordNum);
    strum(chordCalculator.getChordVoicing(cagedPosition, chordNum));
  }
  function handleSetCagedPosition(cagedPosition: string) {
    setCagedPosition(cagedPosition);
    strum(chordCalculator.getChordVoicing(cagedPosition, chordNum));
  }

  function setStringStop([stringNum, fretNum]: FretboardLocation) {
    console.log("setStringStop", [stringNum, fretNum]);
    /*
    const voicing = currentGrip.voicing.slice();
    voicing[stringNum - 1] = fretNum;
    setCurrentGrip({ ...currentGrip, voicing });
    */
  }

  /*
  function handleSetGrip(gripName: string) {
    const grip = grips.find((grip) => grip.name === gripName);
    if (grip) {
      setCurrentGrip({ ...grip });
      strum(grip.voicing);
    }
  }
  */

  /*
  function handleMuteAllStrings() {
    setCurrentGrip({ ...currentGrip, voicing: emptyGrip.voicing });
    muteAll();
  }

  function handleStrum() {
    strum(currentGrip.voicing);
    console.log(currentGrip.voicing);
  }
  */

  function playLocation([stringNum, fretNum]: FretboardLocation) {
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
          voicing={voicing}
          setStringStop={setStringStop}
          playLocation={playLocation}
          stringNodes={getStringNodes()}
        />
      </div>
      <div className="flex-grow-0 pl-2 pr-1">
        <PositionPlayerControls
          soundEnabled={soundEnabled}
          onSetSoundEnabled={handleSetSoundEnabled}
          labeler={labeler}
          onSetLabelingScheme={handleSetLabelingScheme}
          chordList={chordList}
          selectedChordNum={chordNum}
          onSetChordNum={handleSetChordNum}
          positionList={positionList}
          selectedPositionIdx={currentPositionIdx}
          onSetCagedPosition={handleSetCagedPosition}
        />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

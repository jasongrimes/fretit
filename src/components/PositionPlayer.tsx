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
import { Key, Note } from "tonal";

const animationEnabled = true;

const DEFAULT_SETTINGS: FretboardSettings = {
  instrument: "Guitar",
  lowestFret: 0,
  highestFret: 13,
  tonic: "C",
  labeling: "scaleInterval",
  preferSharps: false,
};

export default function PositionPlayer() {
  const [settings, setSettings] = useState<FretboardSettings>(DEFAULT_SETTINGS);
  const instrument = INSTRUMENTS[settings.instrument];
  const [scaleLabeling, setScaleLabeling] = useState("scaleInterval");
  const [keyTonic, setKeyTonic] = useState("C");
  const [keyType, setKeyType] = useState<"major"|"minor">("major");

  const chordCalculator = new ChordCalculator({ keyTonic, keyType });

  const scaleNotes = keyType === "minor" ? Key.minorKey(keyTonic).natural.scale : Key.majorKey(keyTonic).scale;
  const keySignature = keyType === "minor" ? Key.minorKey(keyTonic).keySignature : Key.majorKey(keyTonic).keySignature;
  const key = {
    tonic: keyTonic,
    type: keyType,
    scaleChromas: scaleNotes.map((note) => Note.chroma(note)),
    preferSharps: !keySignature || keySignature.startsWith("#"),
  }

  const [cagedPosition, setCagedPosition] = useState("C"); // TODO: Default to lowest caged position for this key
  const [chordNum, setChordNum] = useState("I");
  const [voicing, setVoicing] = useState(
    chordCalculator.getChordVoicing(cagedPosition, chordNum),
  );

  //const positions = C_MAJOR_POSITIONS;
  //const positionNum = positions[cagedPosition].position;
  // const chordVoicings = positions[cagedPosition].chords;
  //const voicing = chordVoicings[chordNum];
  const chordList = chordCalculator.getChordList();
  const positionList = chordCalculator.getPositionList();
  const currentPositionIdx = positionList.findIndex(
    (position) => position.caged === cagedPosition,
  );

  // const [currentGrip, setCurrentGrip] = useState(grips[positionShape]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const labeler = new FretboardLabeler({
    tuning: instrument.tuning,
    labelingScheme: settings.labeling,
    tonic: keyTonic,
    root: chordCalculator.getChordRoot(chordNum),
    preferSharps: settings.preferSharps,
  });

  if (scaleLabeling !== "none") {
    /*
    const scale = Key.majorKey("D").scale;
    console.log("scale", scale);
    const scaleChroma = scale.map((note) => Note.chroma(note));
    console.log(scaleChroma);

    const matrix = labeler.createMatrixWith(({midi, chroma}) => { 
      if (scaleChroma.includes(chroma)) {
        return { label: labeler.getMidiLabel(chroma, "pitchClass") };
      }
    });

    console.log("matrix", matrix);
    */
    /*
    const numStrings = instrument.tuning.length;
    const numFrets = settings.highestFret - settings.lowestFret;
    const overlayMatrix: (null | { label: string; style?: string })[][] = Array.from({ length: numStrings }, () => Array<null>(numFrets).fill(null));
    scale.forEach((pitchClass) => {
      const midi = Note.midi(pitchClass);
      console.log(`getMidiLocations(${midi})`, labeler.getMidiLocations(midi));
      labeler.getMidiLocations(midi).forEach(([stringNum, fretNum]) => {
        console.log(midi, stringNum, fretNum);
        overlayMatrix[stringNum - 1][fretNum] = {
          label:  pitchClass
        }
      });
    });
    console.log("overlayMatrix", overlayMatrix);
*/
  }
/*
  const overlays: Record<number, string[]>[] = [
    { 0: ["3", "chord-tone"], 1: ["4"], 3: ["5"] },
    { 0: ["7"], 1: ["1", "chord-root opaque"], 3: ["2"] },
    { 0: ["5"], 2: ["6"] },
    { 0: ["2"], 2: ["3"], 3: ["4"] },
    { 0: ["6"], 2: ["7"], 3: ["1"] },
    { 0: ["3"], 1: ["4"], 3: ["5"] },
  ];*/

  const overlays = Array.from(instrument.tuning, (stringMidi) => {
    const minFret = positionList[currentPositionIdx].num - 1;
    const maxFret = positionList[currentPositionIdx].num + 3;
    const stringOverlays = {};
    for (let fret = minFret; fret <= maxFret; fret++) {
      const midi = stringMidi + fret;
      const chroma = midi % 12;
      if (key.scaleChromas.includes(chroma)) {
        stringOverlays[fret] = { label: labeler.getMidiLabel(midi, scaleLabeling) };
      }
    }
    return stringOverlays;
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

  function handleSetCagedPosition(cagedPosition: string) {
    const newVoicing = chordCalculator.getChordVoicing(cagedPosition, chordNum);
    setCagedPosition(cagedPosition);
    setVoicing(newVoicing);
    strum(newVoicing);
  }

  function handleSetChordNum(chordNum: string) {
    const newVoicing = chordCalculator.getChordVoicing(cagedPosition, chordNum);
    setChordNum(chordNum);
    setVoicing(newVoicing);
    strum(newVoicing);
  }

  function setStringStop([stringNum, fretNum]: FretboardLocation) {
    const newVoicing = voicing.slice();
    newVoicing[stringNum - 1] = fretNum;
    setVoicing(newVoicing);
    console.log(newVoicing);
    // TODO: Set an overlay to track the old chord voicing?
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
          overlays={overlays}
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
          scaleLabeling={scaleLabeling}
          onSetScaleLabeling={setScaleLabeling}
        />
      </div>
      <FretboardSettingsForm />
    </div>
  );
}

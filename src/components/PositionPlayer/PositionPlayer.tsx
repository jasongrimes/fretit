import Fretboard from "@/components/Fretboard";
import PositionPlayerControls from "@/components/PositionPlayer/PositionPlayerControls";
import useSound from "@/hooks/use-sound.hook";
import { FretboardLocation, LabelingStrategy } from "@/types";
import { ChordCalculator } from "@/utils/chord-calculator";
import createOverlays from "@/utils/fretboard-overlays";
import { INSTRUMENTS } from "@/utils/instruments";
import createKey from "@/utils/key";
import { useRef, useState } from "react";
import SettingsDialog from "./SettingsDialog";

export default function PositionPlayer() {
  const instrument = INSTRUMENTS.Guitar;
  const numFrets = 15;
  const animationEnabled = true;

  const [showModal, setShowModal] = useState("none"); // none | settings | about

  const [soundEnabled, setSoundEnabled] = useState(true);
  // prettier-ignore
  const [chordLabeling, setChordLabeling] = useState<LabelingStrategy>("scaleInterval");
  const [scaleLabeling, setScaleLabeling] = useState<LabelingStrategy>("none");
  const [keyType, setKeyType] = useState("major");
  const [keyLetter, setKeyLetter] = useState("C");
  const [keyAccidental, setKeyAccidental] = useState("");
  const [positionIndex, setPositionIndex] = useState(0);
  const [chordNum, setChordNum] = useState("I");

  const key = createKey(keyLetter + keyAccidental, keyType);
  const chordCalculator = new ChordCalculator({ keyTonic: key.tonic, keyType });
  const chordList = chordCalculator.getChordList();
  const positions = chordCalculator.getPositions();

  // Current fretboard voicing defaults to the selected chord,
  // but it can be manually changed without changing the chord.
  const [voicing, setVoicing] = useState(
    chordCalculator.getChordVoicing(positionIndex, chordNum),
  );

  const overlays = createOverlays({
    tuning: instrument.tuning,
    voicing: voicing,
    key: key,
    chordRoot: chordCalculator.getChordRoot(chordNum),
    chordStrategy: chordLabeling,
    scaleStrategy: scaleLabeling,
    position: positions[positionIndex].positionNum,
  });
  //console.log(overlays);

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

  function handleSetPositionIndex(positionIndex: number) {
    setPositionIndex(positionIndex);
    handleSetChordNum(chordNum, positionIndex);
  }

  function handleSetChordNum(
    chordNum: string,
    positionIdx: number = positionIndex,
  ) {
    // console.log(`handleSetChordNum(${chordNum}, ${positionIdx})`);
    setChordNum(chordNum);
    const newVoicing = chordCalculator.getChordVoicing(positionIdx, chordNum);
    setVoicing(newVoicing);
    strum(newVoicing);
  }

  function setStringStop([stringNum, fretNum]: FretboardLocation) {
    const newVoicing = voicing.slice();
    newVoicing[stringNum - 1] = fretNum;
    setVoicing(newVoicing);
    // console.log(newVoicing);
    // TODO: Set an overlay to track the old chord voicing?
  }

  function playLocation([stringNum, fretNum]: FretboardLocation) {
    play(stringNum, fretNum);
  }

  function handleToggleSound() {
    setSoundEnabled(!soundEnabled);
  }

  function handleSetLabelingStrategy(scheme: LabelingStrategy) {
    setChordLabeling(scheme);
  }

  function handleSetKey(
    keyLetter: string,
    keyAccidental: string,
    keyType: string,
  ) {
    setKeyLetter(keyLetter);
    setKeyAccidental(keyAccidental);
    setKeyType(keyType);
    chordCalculator.setKey(keyLetter + keyAccidental, keyType);
    handleSetChordNum(keyType === "minor" ? "i" : "I");
  }

  function handleCloseModal() {
    setShowModal("none");
  }

  return (
    <div
      id="position-player"
      className="mx-auto flex max-w-lg overflow-x-hidden"
    >
      <div className="flex-grow">
        <Fretboard
          instrument={instrument}
          numFrets={numFrets}
          voicing={voicing}
          setStringStop={setStringStop}
          playLocation={playLocation}
          stringNodes={getStringNodes()}
          overlays={overlays}
        />
      </div>
      <div className="flex-grow-0 pl-2 pr-2">
        <PositionPlayerControls
          onSetShowModal={setShowModal}
          chordList={chordList}
          selectedChordNum={chordNum}
          onSetChordNum={handleSetChordNum}
          positions={positions}
          positionIndex={positionIndex}
          onSetPositionIndex={handleSetPositionIndex}
          keyLetter={keyLetter}
          keyAccidental={keyAccidental}
          keyType={keyType}
        />
      </div>
      <SettingsDialog
        isOpen={showModal === "settings"}
        onClose={handleCloseModal}
        isSoundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        keyLetter={keyLetter}
        keyAccidental={keyAccidental}
        keyType={keyType}
        onSetKey={handleSetKey}
        chordLabeling={chordLabeling}
        onSelectChordLabeling={handleSetLabelingStrategy}
        scaleLabeling={scaleLabeling}
        onSetScaleLabeling={setScaleLabeling}
      />
    </div>
  );
}

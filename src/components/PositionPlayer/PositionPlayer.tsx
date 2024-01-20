import Fretboard from "@/components/Fretboard";
import PositionPlayerControls from "@/components/PositionPlayer/PositionPlayerControls";
import useSound from "@/hooks/use-sound.hook";
import { FretboardLocation, LabelingStrategy } from "@/types";
import { ChordCalculator } from "@/utils/chord-calculator";
import createOverlays from "@/utils/fretboard-overlays";
import { INSTRUMENTS } from "@/utils/instruments";
import createKey from "@/utils/key";
import { useRef, useState } from "react";
import AboutDialog from "./AboutDialog";
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

  // The current voicing on the fretboard defaults to the selected chord,
  // but the user can manually stop the strings at different frets without changing the selected chord.
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

  // Create a map of string DOM nodes so we can play animations on the correct string.
  const stringsRef = useRef<Map<number, HTMLElement> | null>(null);
  function getStringNodes() {
    if (!stringsRef.current) {
      stringsRef.current = new Map<number, HTMLElement>();
    }
    return stringsRef.current;
  }

  function playStringAnimation(stringNum: number) {
    if (animationEnabled) {
      const node = getStringNodes().get(stringNum);
      if (node?.classList.contains("plucked")) {
        node?.classList.remove("plucked");
        void node?.offsetHeight; // Hack to force DOM reflow so we can restart the animation.
      }
      node?.classList.add("plucked");
    }
  }

  // Set up the sound player.
  const { play, strum } = useSound({
    tuning: instrument.tuning,
    muted: !soundEnabled,
    onPlayString: playStringAnimation,
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

  // TODO: Rename to handleSetStringStop?
  function setStringStop([stringNum, fretNum]: FretboardLocation) {
    const newVoicing = voicing.slice();
    newVoicing[stringNum - 1] = fretNum;
    setVoicing(newVoicing);
    // console.log(newVoicing);
    // TODO: Set an overlay to track the old chord voicing?
  }

  // TODO: Rename to handlePlayLocation? Or maybe handlePlayFretNote?
  function playLocation([stringNum, fretNum]: FretboardLocation) {
    play(stringNum, fretNum);
  }

  function handleToggleSound() {
    setSoundEnabled(!soundEnabled);
  }

  function handleSetKey(
    keyLetter: string,
    keyAccidental: string,
    keyType: string,
  ) {
    setKeyLetter(keyLetter);
    setKeyAccidental(keyAccidental);
    setKeyType(keyType);
    // TODO: Don't mutate chordCalculator to deliberately cause a side effect on handleSetChordNum.
    // Refactor chordCalculator to inject the key into each function call.
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
          keyData={key}
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
        onSelectChordLabeling={setChordLabeling}
        scaleLabeling={scaleLabeling}
        onSetScaleLabeling={setScaleLabeling}
      />
      <AboutDialog isOpen={showModal === "about"} onClose={handleCloseModal} />
    </div>
  );
}

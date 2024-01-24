import Fretboard from "@/components/Fretboard";
import Header from "@/components/Header";
import PositionPlayerControls from "@/components/PositionPlayer/PositionPlayerControls";
import useSound from "@/hooks/use-sound.hook";
import { LabelingStrategy } from "@/types";
import {
  getChordList,
  getChordRoot,
  getChordVoicing,
  getPositions,
} from "@/utils/chord-calculator";
import createOverlays from "@/utils/fretboard-overlays";
import { INSTRUMENTS } from "@/utils/instruments";
import createKey, { Key } from "@/utils/key";
import { useRef, useState } from "react";
import AboutDialog from "./AboutDialog";
import SettingsDialog from "./SettingsDialog";
import { Link } from "@tanstack/react-router";

export default function PositionPlayer() {
  const instrument = INSTRUMENTS.Guitar;
  const numFrets = 15;
  const animationEnabled = true;

  const [maximized, setMaximized] = useState(false);

  const [showModal, setShowModal] = useState("none"); // none | settings | about
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chordLabeling, setChordLabeling] =
    useState<LabelingStrategy>("scaleInterval");
  const [scaleLabeling, setScaleLabeling] =
    useState<LabelingStrategy>("scaleInterval");
  const [keyType, setKeyType] = useState("major");
  const [keyLetter, setKeyLetter] = useState("C");
  const [keyAccidental, setKeyAccidental] = useState("");
  const [positionIndex, setPositionIndex] = useState(0);
  const [chordNum, setChordNum] = useState("I");

  const key = createKey(keyLetter + keyAccidental, keyType);
  const chordList = getChordList(key);
  const positions = getPositions(key);
  // The current voicing on the fretboard defaults to the selected chord,
  // but the user can manually stop the strings at different frets without changing the selected chord.
  const chordVoicing = getChordVoicing(key, positionIndex, chordNum);
  const [voicing, setVoicing] = useState(chordVoicing);

  const overlays = createOverlays({
    tuning: instrument.tuning,
    key: key,
    voicing: voicing,
    originalVoicing: chordVoicing,
    chordRoot: getChordRoot(key, chordNum),
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
    inKey: Key = key,
  ) {
    setChordNum(chordNum);
    const newVoicing = getChordVoicing(inKey, positionIdx, chordNum);
    setVoicing(newVoicing);
    strum(newVoicing);
  }

  function handleSetStringStop(stringNum: number, fretNum: number) {
    const newVoicing = voicing.slice();
    newVoicing[stringNum - 1] = fretNum;
    setVoicing(newVoicing);
  }

  function handlePlayFretNote(stringNum: number, fretNum: number) {
    play(stringNum, fretNum);
  }

  function handleToggleSound() {
    setSoundEnabled(!soundEnabled);
  }

  function handleToggleMaximized() {
    setMaximized(!maximized);
  }

  function handleSetKey(
    keyLetter: string,
    keyAccidental: string,
    keyType: string,
  ) {
    setKeyLetter(keyLetter);
    setKeyAccidental(keyAccidental);
    setKeyType(keyType);
    const newKey = createKey(keyLetter + keyAccidental, keyType);
    handleSetChordNum(keyType === "minor" ? "i" : "I", positionIndex, newKey);
  }

  function handleCloseModal() {
    setShowModal("none");
  }

  return (
    <>
      {!maximized && (
        <Header>
          <Link className="btn btn-ghost text-xl md:text-2xl" to="/positions">Position Player</Link>
        </Header>
      )}
      <main className=" max-w-[100vw] pb-4">
        <div
          id="position-player"
          className="mx-auto flex max-w-lg overflow-x-hidden"
        >
          <div className="flex-grow">
            <Fretboard
              instrument={instrument}
              numFrets={numFrets}
              voicing={voicing}
              onSetStringStop={handleSetStringStop}
              onPlayFretNote={handlePlayFretNote}
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
              maximized={maximized}
              onToggleMaximized={handleToggleMaximized}
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
          <AboutDialog
            isOpen={showModal === "about"}
            onClose={handleCloseModal}
          />
        </div>
      </main>
    </>
  );
}

import Fretboard from "@/components/Fretboard";
import PositionPlayerControls from "@/components/PositionPlayerControls";
import useSound from "@/hooks/use-sound.hook";
import { FretboardLocation } from "@/types";
import { ChordCalculator, createKey } from "@/utils/chord-calculator";
import { FretboardLabeler, LabelingStrategy } from "@/utils/fretboard-labeler";
import { INSTRUMENTS } from "@/utils/instruments";
import { useRef, useState } from "react";

export default function PositionPlayer() {
  const instrument = INSTRUMENTS.Guitar;
  const numFrets = 15;
  const animationEnabled = true;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chordLabeling, setChordLabeling] =
    useState<LabelingStrategy>("scaleInterval");
  const [scaleLabeling, setScaleLabeling] = useState<LabelingStrategy>("none");
  const [keyType, setKeyType] = useState("major");
  const [keyLetter, setKeyLetter] = useState("C");
  const [keyAccidental, setKeyAccidental] = useState("");
  const [positionIndex, setPositionIndex] = useState(0);
  const [chordNum, setChordNum] = useState("I");

  const keyTonic = keyLetter + keyAccidental;
  const chordCalculator = new ChordCalculator({ keyTonic, keyType });
  const chordList = chordCalculator.getChordList();
  const positions = chordCalculator.getPositions();

  // Current fretboard voicing defaults to the selected chord,
  // but it can be manually changed without changing the chord.
  const [voicing, setVoicing] = useState(
    chordCalculator.getChordVoicing(positionIndex, chordNum),
  );

  //
  // TODO: Rework this hacky stuff for setting up labeling and overlays.
  //
  /*
  const scaleNotes =
    keyType === "minor"
      ? TonalKey.minorKey(keyTonic).natural.scale
      : TonalKey.majorKey(keyTonic).scale;
  const keySignature =
    keyType === "minor"
      ? TonalKey.minorKey(keyTonic).keySignature
      : TonalKey.majorKey(keyTonic).keySignature;
  const key:Key = {
    tonic: keyTonic,
    type: keyType,
    keySignature: keySignature,
    scaleNotes: scaleNotes,
    scaleChromas: scaleNotes.map((note) => Note.chroma(note) ?? 0),
    preferSharps: !keySignature || keySignature.startsWith("#"),
  };
  // console.log("key", key);
  */

  const labeler = new FretboardLabeler({
    tuning: instrument.tuning,
    key: createKey(keyTonic, keyType),
    chordRoot: chordCalculator.getChordRoot(chordNum),
    chordStrategy: chordLabeling,
    scaleStrategy: scaleLabeling,
  });

  /*
  const overlays = Array.from(instrument.tuning, (stringMidi) => {
    // TODO: Improve the position data so it's truly the lowest fret in the position, then change this to simply position thru position+5
    let minFret = positions[positionIndex].positionNum - 1;
    let maxFret = positions[positionIndex].positionNum + 3;
    if (minFret < 0) {
      minFret++;
      maxFret++;
    }
    const stringOverlays: StringOverlays = {};
    for (let fret = minFret; fret <= maxFret; fret++) {
      const midi = stringMidi + fret;
      const chroma = midi % 12;
      if (key.scaleChromas.includes(chroma)) {
        stringOverlays[fret] = {
          label: labeler.getMidiLabel(midi, scaleLabeling),
          style: "scale",
        };
      }
    }
    return stringOverlays;
  });
  // console.log(key);
  // console.log(overlays);
*/
  const overlays = labeler.getOverlays(
    voicing,
    positions[positionIndex].positionNum,
  );
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

  function handleSetSoundEnabled(enabled: boolean) {
    setSoundEnabled(enabled);
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

  return (
    <div className="fretboard-player mx-auto flex max-w-lg  overflow-x-hidden">
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
          soundEnabled={soundEnabled}
          onSetSoundEnabled={handleSetSoundEnabled}
          chordLabeling={chordLabeling}
          onSetLabelingStrategy={handleSetLabelingStrategy}
          chordList={chordList}
          selectedChordNum={chordNum}
          onSetChordNum={handleSetChordNum}
          positions={positions}
          positionIndex={positionIndex}
          onSetPositionIndex={handleSetPositionIndex}
          scaleLabeling={scaleLabeling}
          onSetScaleLabeling={setScaleLabeling}
          keyLetter={keyLetter}
          keyAccidental={keyAccidental}
          keyType={keyType}
          onSetKey={handleSetKey}
        />
      </div>
    </div>
  );
}

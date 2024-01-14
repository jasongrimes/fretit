import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChevronsDown,
  IconChevronsUp,
  IconHeart,
  IconInfoCircle,
  IconSettings,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
import { Position } from "../services/chord-calculator";
import { FretboardLabeler, LabelingScheme } from "../services/fretboard";

interface Props {
  soundEnabled: boolean;
  onSetSoundEnabled: (enabled: boolean) => void;
  labeler: FretboardLabeler;
  onSetLabelingScheme: (scheme: LabelingScheme) => void;
  chordList: { root: string; roman: string; name: string }[];
  selectedChordNum: string;
  onSetChordNum: (chordNum: string) => void;
  positions: Position[];
  positionIndex: number;
  onSetPositionIndex: (positionIndex: number) => void;
  scaleLabeling: string;
  onSetScaleLabeling: (scaleLabeling: string) => void;
  keyLetter: string;
  keyAccidental: string;
  keyType: string;
  onSetKey: (keyLetter: string, keyAccidental: string, keyType: string) => void;
}
export default function PositionPlayerControls({
  soundEnabled,
  onSetSoundEnabled,
  labeler,
  onSetLabelingScheme,
  chordList,
  selectedChordNum,
  onSetChordNum,
  positions,
  positionIndex,
  onSetPositionIndex,
  scaleLabeling,
  onSetScaleLabeling,
  keyLetter,
  keyAccidental,
  keyType,
  onSetKey,
}: Props) {
  const [maximized, setMaximized] = useState(false);

  const selectedPosition = positions[positionIndex];

  function handleToggleMaximized() {
    setMaximized(!maximized);
  }

  function handleSoundClick() {
    onSetSoundEnabled(!soundEnabled);
  }

  function handleSetPositionIndex(positionIndex: number) {
    if (positionIndex < 0 || positionIndex > positions.length - 1) {
      return;
    }
    onSetPositionIndex(positionIndex);
    scrollToPositionNum(positions[positionIndex].positionNum);
  }

  function scrollToPositionNum(num: number) {
    if (num <= 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .querySelector(`.fret-note:nth-child(${num - 1})`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleSelectLabelingScheme(e: ChangeEvent<HTMLSelectElement>) {
    onSetLabelingScheme(e.target.value);
  }

  function handleSelectScaleLabeling(e: ChangeEvent<HTMLSelectElement>) {
    onSetScaleLabeling(e.target.value);
  }

  return (
    <>
      <div className={` ${maximized ? "w-16" : "w-32"} `}>
        <ul className="menu fixed z-10 rounded-box bg-base-300 text-base-content">
          <li>
            <a
              onClick={() =>
                document.getElementById("about-modal")?.showModal()
              }
            >
              <IconInfoCircle className="h-5 w-5" />
              {!maximized && <>About</>}
            </a>
          </li>

          {/* Settings */}
          <li>
            <a
              onClick={() =>
                document.getElementById("settings-modal")?.showModal()
              }
            >
              <IconSettings className="h-5 w-5" />
              {!maximized && <>Settings</>}
            </a>
          </li>

          {/* Key */}
          <li className="menu-title px-0 text-center">
            {maximized ? (
              <>
                {keyLetter}
                {keyAccidental} {keyType === "minor" ? "m" : ""}
              </>
            ) : (
              <>
                {keyLetter}
                {keyAccidental} {keyType}
              </>
            )}
          </li>

          {/* Position selector */}
          <li className="w-full">
            <details className="dropdown dropdown-end">
              <summary
                className={
                  maximized
                    ? "justify-center gap-0 truncate px-0 after:w-0"
                    : "justify-center"
                }
              >
                {maximized ? (
                  <>
                    {selectedPosition.roman} ({selectedPosition.caged})
                  </>
                ) : (
                  <>
                    {selectedPosition.label} ({selectedPosition.caged})
                  </>
                )}
              </summary>
              <ul className="menu dropdown-content z-[10] w-52 rounded-box bg-base-200 p-2 shadow">
                <li className="menu-title">
                  <h2 className="text-lg">Position</h2>
                </li>
                <li className="menu-title flex flex-row">
                  <div className="w-14 pr-4 text-right underline">Fret</div>
                  <div className="underline">
                    CAGED {keyType === "minor" ? "i" : "I"}-chord
                  </div>
                </li>
                {positions.map((position, i) => {
                  return (
                    <li key={i}>
                      <a
                        onClick={() => handleSetPositionIndex(i)}
                        className={i === positionIndex ? "active" : ""}
                      >
                        <div className="w-14 pr-4 text-right">
                          <b>{position.label}</b>
                        </div>
                        <div>
                          <b>{position.caged}</b>-shape{" "}
                          {keyType === "minor" ? "i" : "I"}
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>

          {/* Chords */}
          {chordList.map((chord) => {
            return (
              <li className="w-full" key={chord.name}>
                <a
                  className={`block flex w-full truncate text-clip px-0 text-center ${
                    selectedChordNum === chord.roman ? "active" : ""
                  }`}
                  onClick={() => onSetChordNum(chord.roman)}
                >
                  <span className="w-1/2 text-right text-base-content">
                    {chord.roman}
                  </span>
                  <span className="w-1/2 text-left text-accent">
                    {chord.name}
                  </span>
                </a>
              </li>
            );
          })}

          {/* Position */}
          <li className={positionIndex === 0 ? "disabled" : ""}>
            <a
              className="justify-around"
              onClick={() => handleSetPositionIndex(positionIndex - 1)}
            >
              <IconChevronsUp className="h-5 w-5" />
            </a>
          </li>

          <li
            className={positionIndex >= positions.length - 1 ? "disabled" : ""}
          >
            <a
              className="justify-around"
              onClick={() => handleSetPositionIndex(positionIndex + 1)}
            >
              <IconChevronsDown className="h-5 w-5" />
            </a>
          </li>

          {/* Maximize */}
          <li>
            <a onClick={handleToggleMaximized}>
              {maximized ? (
                <IconArrowsMinimize className="h-5 w-5" />
              ) : (
                <>
                  <IconArrowsMaximize className="h-5 w-5" />
                  Maximize
                </>
              )}
            </a>
          </li>
        </ul>
      </div>

      {/* Settings modal */}
      <dialog
        id="settings-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Settings</h3>

          {/* Toggle sound */}
          <div className="form-control mt-4 max-w-fit">
            <label className="label cursor-pointer gap-4">
              <span className="label-text flex gap-2">
                {soundEnabled ? (
                  <IconVolume className="h-5 w-5" />
                ) : (
                  <IconVolumeOff className="h-5 w-5" />
                )}
                Enable sound
              </span>
              <input
                type="checkbox"
                className="toggle"
                checked={soundEnabled}
                onChange={handleSoundClick}
              />
            </label>
          </div>
          <div className="label pt-0">
            <span className="label-text-alt">
              Tip: make sure your device is not in &quot;silent&quot; mode.
            </span>
          </div>

          {/* Select key */}
          <label className="form-control mt-2 w-full max-w-xs">
            <div className="label">
              <span className="label-text">Key</span>
            </div>
            <div className="form-control flex-row gap-2">
              <select
                className="select select-bordered"
                onChange={(e) =>
                  onSetKey(e.target.value, keyAccidental, keyType)
                }
                defaultValue={keyLetter}
              >
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>

              <select
                className="select select-bordered"
                onChange={(e) => onSetKey(keyLetter, e.target.value, keyType)}
                defaultValue={keyAccidental}
              >
                <option value=""></option>
                <option value="#">#</option>
                <option value="b">b</option>
              </select>

              <select
                className="select select-bordered grow"
                onChange={(e) =>
                  onSetKey(keyLetter, keyAccidental, e.target.value)
                }
                defaultValue={keyType}
              >
                <option value="major">major</option>
                <option value="minor">minor</option>
              </select>
            </div>
          </label>

          {/* Select chord note labeling scheme */}
          <label className="form-control mt-4 w-full max-w-xs">
            <div className="label">
              <span className="label-text">Chord note labels</span>
            </div>
            <select
              className="select select-bordered"
              onChange={handleSelectLabelingScheme}
              defaultValue={labeler.scheme}
            >
              <option value="scaleInterval">Scale degrees (1..7)</option>
              <option value="chordInterval">Chord intervals (R..7)</option>
              <option value="pitchClass">Note names</option>
              <option value="pitch">Note names + octave</option>
              <option value="none">None</option>
            </select>
          </label>

          {/* Select scale note labels */}
          <label className="form-control mt-4 w-full max-w-xs">
            <div className="label">
              <span className="label-text">Scale note labels</span>
            </div>
            <select
              className="select select-bordered"
              onChange={handleSelectScaleLabeling}
              defaultValue={scaleLabeling}
            >
              <option value="scaleInterval">Scale degrees (1..7)</option>
              <option value="pitchClass">Note names</option>
              <option value="pitch">Note names + octave</option>
              <option value="none">None</option>
            </select>
          </label>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        {/* there a second form with 'modal-backdrop' class and it covers the screen so we can close the modal when clicked outside */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* About modal */}
      <dialog id="about-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h2 className="text-2xl font-bold">About</h2>

          <p className="py-4">
            This is a tool for exploring chord positions on guitar.{" "}
            All the chords in a key can be found right next to each other,
            without moving the hand out of position. There are five such chord
            groupings up and down the neck.
          </p>

          <p className="py-2">
            Tap a string to play a note. Swipe to strum. Press and hold to mute.
            Open &quot;settings&quot; to change key, labels, or toggle sound.
          </p>

          <p className="py-2">
            Practical ways to play these{" "}
            <a
              className="link link-primary"
              href="https://fretboardfoundation.com/caged.html"
              target="_blank"
              rel="noreferrer"
            >
              CAGED chord grips
            </a>{" "}
            and the basics of{" "}
            <a
              className="link link-primary"
              href="https://fretboardfoundation.com/major-harmony.html"
              target="_blank"
              rel="noreferrer"
            >
              major key
            </a>{" "}
            and{" "}
            <a
              className="link link-primary"
              href="https://fretboardfoundation.com/minor-harmony.html"
              target="_blank"
              rel="noreferrer"
            >
              minor key
            </a>{" "}
            harmony are described in the free book <i>Fretboard Foundation</i>.
          </p>

          <p>
            Questions? Comments? Send an email to{" "}
            <a className="link link-primary" href="mailto:hello@fretit.com">
              hello@fretit.io
            </a>
            . 
          </p>

          <div className="modal-action">
            <div className="grow pt-4 text-sm text-gray-500">
              Made with <IconHeart className="inline h-5 w-5 text-red-500" /> by{" "}
              <a
                className="link"
                href="https://grimesit.com"
                target="_blank"
                rel="noreferrer"
              >
                Grimes IT
              </a>
              .
            </div>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        {/* there a second form with 'modal-backdrop' class and it covers the screen so we can close the modal when clicked outside */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

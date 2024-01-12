import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChevronDown,
  IconChevronUp,
  IconChevronsDown,
  IconChevronsUp,
  IconCircleFilled,
  IconCircleLetterC,
  IconCircleLetterR,
  IconCircleNumber1,
  IconGridDots,
  IconInfoCircle,
  IconKey,
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
  positionList: Position[];
  selectedPositionIdx: number;
  onSetCagedPosition: (cagedPosition: string) => void;
  scaleLabeling: string;
  onSetScaleLabeling: (scaleLabeling: string) => void;
}
export default function PositionPlayerControls({
  soundEnabled,
  onSetSoundEnabled,
  labeler,
  onSetLabelingScheme,
  chordList,
  selectedChordNum,
  onSetChordNum,
  positionList,
  selectedPositionIdx,
  onSetCagedPosition,
  scaleLabeling,
  onSetScaleLabeling
}: Props) {
  const [maximized, setMaximized] = useState(false);
  const [showAccordion, setShowAccordion] = useState("chords");

  const selectedPosition = positionList[selectedPositionIdx];

  function handleToggleMaximized() {
    setMaximized(!maximized);
  }
  function handleToggleAccordion() {
    setShowAccordion(showAccordion === "chords" ? "controls" : "chords");
  }

  function handleSoundClick() {
    onSetSoundEnabled(!soundEnabled);
  }

  function handleSetPosition(position: Position) {
    onSetCagedPosition(position.caged);
    scrollToPositionNum(position.num);
  }

  function setPositionIndex(i: number) {
    if (i < 0 || i > positionList.length - 1) {
      return;
    }
    handleSetPosition(positionList[i]);
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
            <a>
              <IconInfoCircle className="h-5 w-5" />
              {!maximized && <>About</>}
            </a>
          </li>

          <li className="menu-title cursor-pointer">
            <a className="flex gap-1" onClick={handleToggleAccordion}>
              {showAccordion === "chords" ? (
                <IconChevronUp className="h-4 w-4" />
              ) : (
                <IconChevronDown className="h-4 w-4" />
              )}
              {!maximized && <>Chords</>}
            </a>
          </li>

          {/* Chords accordion section */}
          {showAccordion === "chords" && (
            <>
              {/* Key */}
              <li>
                <a>
                  <IconKey className="h-5 w-5" />
                  {!maximized && <>C major</>}
                </a>
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
                    <li className="menu-title">Position</li>
                    {positionList.map((position) => {
                      return (
                        <li key={position.caged}>
                          <a
                            onClick={() => handleSetPosition(position)}
                            className={
                              position.caged === selectedPosition.caged
                                ? "active"
                                : ""
                            }
                          >
                            <b>{position.label}</b>({position.caged}-shape I)
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
                      className={`block flex w-full truncate text-clip px-0 text-center text-accent ${
                        selectedChordNum === chord.roman ? "active" : ""
                      }`}
                      onClick={() => onSetChordNum(chord.roman)}
                    >
                      <span className="w-1/2 text-right text-base-content">
                        {chord.roman}:
                      </span>
                      <span className=" w-1/2 text-left">{chord.name}</span>
                    </a>
                  </li>
                );
              })}

              {/* Position */}
              <li className={selectedPositionIdx === 0 ? "disabled" : ""}>
                <a
                  className="justify-around"
                  onClick={() => setPositionIndex(selectedPositionIdx - 1)}
                >
                  <IconChevronsUp className="h-5 w-5" />
                </a>
              </li>

              <li
                className={
                  selectedPositionIdx >= positionList.length - 1
                    ? "disabled"
                    : ""
                }
              >
                <a
                  className="justify-around"
                  onClick={() => setPositionIndex(selectedPositionIdx + 1)}
                >
                  <IconChevronsDown className="h-5 w-5" />
                </a>
              </li>
            </>
          )}

          <li className="menu-title cursor-pointer">
            <a className="flex gap-1" onClick={handleToggleAccordion}>
              {showAccordion === "controls" ? (
                <IconChevronUp className="h-4 w-4" />
              ) : (
                <IconChevronDown className="h-4 w-4" />
              )}
              {!maximized && <>Controls</>}
            </a>
          </li>

          {/* Controls accordion section */}
          {showAccordion === "controls" && (
            <>
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
            </>
          )}
        </ul>
      </div>

      <dialog
        id="settings-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Settings</h3>

          {/* Toggle sound */}
          <div className="form-control max-w-fit">
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
                onClick={handleSoundClick}
              />
            </label>
          </div>

          {/* Select chord note labeling scheme */}
          <label className="form-control w-full max-w-xs mb-2">
            <div className="label">
              <span className="label-text">Chord note labels</span>
            </div>
            <select
              className="select select-bordered"
              onChange={handleSelectLabelingScheme}
            >
              <option
                value="scaleInterval"
                selected={labeler.scheme === "scaleInterval"}
              >
                Scale degrees (1..7)
              </option>
              <option
                value="chordInterval"
                selected={labeler.scheme === "chordInterval"}
              >
                Chord intervals (R..7)
              </option>
              <option
                value="pitchClass"
                selected={labeler.scheme === "pitchClass"}
              >
                Note names
              </option>
              <option value="pitch" selected={labeler.scheme === "pitch"}>
                Note names + octave
              </option>
              <option value="none" selected={labeler.scheme === "none"}>
                None
              </option>
            </select>
          </label>

          {/* Select scale note labels */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Scale note labels</span>
            </div>
            <select
              className="select select-bordered"
              onChange={handleSelectScaleLabeling}
            >
              <option
                value="degree"
                selected={scaleLabeling === "degree"}
              >
                Scale degrees (1..7)
              </option>
              <option
                value="pitchClass"
                selected={scaleLabeling === "pitchClass"}
              >
                Note names
              </option>
              <option value="none" selected={scaleLabeling === "none"}>
                None
              </option>
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
    </>
  );
}

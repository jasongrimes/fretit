import { Key } from "@/types";
import { Position } from "@/utils/chord-calculator";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChevronsDown,
  IconChevronsUp,
  IconHeart,
  IconInfoCircle,
  IconSettings,
} from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

interface Props {
  onSetShowModal: (modal: string) => void;
  chordList: { root: string; roman: string; name: string }[];
  selectedChordNum: string;
  onSetChordNum: (chordNum: string) => void;
  positions: Position[];
  positionIndex: number;
  onSetPositionIndex: (positionIndex: number) => void;
  keyData: Key;
}
export default function PositionPlayerControls({
  onSetShowModal,
  chordList,
  selectedChordNum,
  onSetChordNum,
  positions,
  positionIndex,
  onSetPositionIndex,
  keyData,
}: Props) {
  const [maximized, setMaximized] = useState(false);
  const aboutDialogRef = useRef<HTMLDialogElement | null>(null);
  const key = keyData;
  const selectedPosition = positions[positionIndex];

  function handleToggleMaximized() {
    setMaximized(!maximized);
  }

  function handleSetPositionIndex(positionIndex: number) {
    if (positionIndex < 0 || positionIndex > positions.length - 1) {
      return;
    }
    onSetPositionIndex(positionIndex);

    // TODO: Move this scrolling into a useEffect. It fails when changing positions too quickly.
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

  const handleSetChordNum = useCallback(
    (roman: string) => {
      onSetChordNum(roman);
    },
    [onSetChordNum],
  );

  function handleShowAbout() {
    aboutDialogRef.current?.showModal();
  }

  return (
    <>
      <div className={` ${maximized ? "w-16" : "w-32"} `}>
        <ul
          className="menu fixed z-10 rounded-box bg-base-300 text-base-content"
          aria-label="controls"
        >
          <li>
            <a onClick={handleShowAbout}>
              <IconInfoCircle className="h-5 w-5" />
              {!maximized && <>About</>}
            </a>
          </li>

          {/* Settings */}
          <li>
            <a onClick={() => onSetShowModal("settings")} aria-label="Settings">
              <IconSettings className="h-5 w-5" />
              {!maximized && <>Settings</>}
            </a>
          </li>

          {/* Key */}
          <li className="menu-title px-0 text-center">
            {maximized ? (
              <>
                {key.tonic}
                {key.type === "minor" ? "m" : ""}
              </>
            ) : (
              <>
                {key.tonic} {key.type}
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
                    CAGED {key.type === "minor" ? "i" : "I"}-chord
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
                          {key.type === "minor" ? "i" : "I"}
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
              <li className="w-full" key={chord.roman}>
                <a
                  aria-label={`Select ${chord.name} chord`}
                  className={`flex w-full truncate text-clip px-0 text-center ${
                    selectedChordNum === chord.roman ? "active" : ""
                  }`}
                  onClick={() => handleSetChordNum(chord.roman)}
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

      {/* About modal */}
      <dialog
        ref={aboutDialogRef}
        id="about-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h2 className="text-2xl font-bold">About</h2>

          <p className="py-4">
            A tool for exploring chord positions on guitar, showing how all
            chords in a key can be found right next to each other, in five
            different positions on the neck.
          </p>

          <p className="my-2 bg-base-300 p-2">
            {/* <div className="divider text-sm mt-0 mb-1">Usage:</div> */}
            <span className="mb-1 block font-bold text-primary">
              Play the fretboard
            </span>
            Tap to pluck. Swipe to strum. Long-press to mute.{" "}
            <span className="whitespace-nowrap text-sm text-gray-500">
              (Turn off &quot;silent&quot; mode on mobile.)
            </span>
          </p>

          <p className="my-2 bg-base-300 p-2">
            <span className="mb-1 block font-bold text-secondary">
              Learn more
            </span>
            Learn{" "}
            <a
              // Hack alert:
              // I hate to add this focus:outline-none here,
              // but the HTML <dialog> behavior makes it autofocus on showModal() and the outline looks terrible,
              // and React has a bug that prevents setting autofocus somewhere else.
              // See https://github.com/facebook/react/issues/23301
              className="link link-accent focus:outline-none"
              href="https://fretboardfoundation.com/caged.html"
              target="_blank"
              rel="noreferrer"
            >
              practical CAGED chord grips
            </a>{" "}
            and basic{" "}
            <a
              className="link link-accent"
              href="https://fretboardfoundation.com/major-harmony.html"
              target="_blank"
              rel="noreferrer"
            >
              major key
            </a>{" "}
            and{" "}
            <a
              className="link link-accent"
              href="https://fretboardfoundation.com/minor-harmony.html"
              target="_blank"
              rel="noreferrer"
            >
              minor key
            </a>{" "}
            harmony in the free book <i>Fretboard Foundation</i>.
          </p>

          <p className="py-2">
            Questions or comments? I&apos;d love to hear from you. Email{" "}
            <a className="link link-accent" href="mailto:hello@fretit.com">
              jason@fretit.io
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
            <form method="dialog" autoFocus>
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

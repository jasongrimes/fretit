import { Key } from "@/types";
import { Position } from "@/utils/chord-calculator";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChevronsDown,
  IconChevronsUp,
  IconInfoCircle,
  IconSettings,
} from "@tabler/icons-react";
import { useCallback, useEffect } from "react";

interface PositionPlayerControlsProps {
  onSetShowModal: (modal: string) => void;
  chordList: { root: string; roman: string; name: string }[];
  selectedChordNum: string;
  onSetChordNum: (chordNum: string) => void;
  positions: Position[];
  positionIndex: number;
  onSetPositionIndex: (positionIndex: number) => void;
  keyData: Key;
  maximized: boolean;
  onToggleMaximized: () => void;
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
  maximized,
  onToggleMaximized,
}: PositionPlayerControlsProps) {
  const key = keyData;

  useEffect(() => {
    scrollToPositionNum(positions[positionIndex].positionNum);
  }, [positions, positionIndex]);

  const handleSetChordNum = useCallback(
    (roman: string) => {
      onSetChordNum(roman);
    },
    [onSetChordNum],
  );

  function handleSetPositionIndex(positionIndex: number) {
    if (positionIndex < 0 || positionIndex > positions.length - 1) {
      return;
    }
    onSetPositionIndex(positionIndex);
  }

  function scrollToPositionNum(num: number) {
    if (num <= 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .querySelector(`.fret-note:nth-child(${num})`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <div className={`${maximized ? "w-16" : "w-32"} `}>
        <ul
          className="menu fixed z-10 rounded-box bg-base-300 text-base-content"
          aria-label="controls"
        >
          <li>
            <a onClick={() => onSetShowModal("about")} aria-label="About">
              <IconInfoCircle className="h-5 w-5" />
              {!maximized && <>About</>}
            </a>
          </li>

          <li>
            <a onClick={() => onSetShowModal("settings")} aria-label="Settings">
              <IconSettings className="h-5 w-5" />
              {!maximized && <>Settings</>}
            </a>
          </li>

          <KeyLabel maximized={maximized} keyData={key} />

          <PositionSelector
            maximized={maximized}
            positions={positions}
            positionIndex={positionIndex}
            onSetPositionIndex={handleSetPositionIndex}
            keyData={key}
          />

          <ChordSelector
            chordList={chordList}
            selectedChordNum={selectedChordNum}
            onSetChordNum={handleSetChordNum}
          />

          <PositionSpinner
            positions={positions}
            positionIndex={positionIndex}
            onSetPositionIndex={handleSetPositionIndex}
          />

          <MaximizeControl
            maximized={maximized}
            onToggleMaximized={onToggleMaximized}
          />
        </ul>
      </div>
    </>
  );
}

function KeyLabel({
  maximized,
  keyData,
}: {
  maximized: boolean;
  keyData: Key;
}) {
  const key = keyData;
  return (
    <li className="menu-title px-0 text-center" aria-label="Key">
      {maximized ? (
        <>
          {key.tonic} {key.type === "minor" ? "m" : ""}
        </>
      ) : (
        <>
          {key.tonic} {key.type}
        </>
      )}
    </li>
  );
}

function MaximizeControl({
  maximized,
  onToggleMaximized,
}: {
  maximized: boolean;
  onToggleMaximized: () => void;
}) {
  return (
    <li>
      <a onClick={onToggleMaximized}>
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
  );
}

interface PositionSelectorProps {
  maximized: boolean;
  positions: Position[];
  positionIndex: number;
  onSetPositionIndex: (positionIndex: number) => void;
  keyData: Key;
}
function PositionSelector({
  maximized,
  positions,
  positionIndex,
  onSetPositionIndex,
  keyData,
}: PositionSelectorProps) {
  const key = keyData;
  const selectedPosition = positions[positionIndex];

  return (
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
            <h2 className="text-lg">Select position</h2>
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
                  onClick={() => onSetPositionIndex(i)}
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
  );
}

interface ChordSelectorProps {
  chordList: { root: string; roman: string; name: string }[];
  selectedChordNum: string;
  onSetChordNum: (chordNum: string) => void;
}
function ChordSelector({
  chordList,
  selectedChordNum,
  onSetChordNum,
}: ChordSelectorProps) {
  return (
    <>
      {chordList.map((chord) => {
        return (
          <li className="w-full" key={chord.roman}>
            <a
              aria-label={`Select ${chord.name} chord`}
              className={`flex w-full truncate text-clip px-0 text-center ${
                selectedChordNum === chord.roman ? "active" : ""
              }`}
              onClick={() => onSetChordNum(chord.roman)}
            >
              <span className="w-1/2 text-right text-base-content">
                {chord.roman}
              </span>
              <span className="w-1/2 text-left text-accent">{chord.name}</span>
            </a>
          </li>
        );
      })}
    </>
  );
}

interface PositionSpinnerProps {
  positions: Position[];
  positionIndex: number;
  onSetPositionIndex: (positionIndex: number) => void;
}
function PositionSpinner({
  positions,
  positionIndex,
  onSetPositionIndex,
}: PositionSpinnerProps) {
  return (
    <>
      <li className={positionIndex === 0 ? "disabled" : ""}>
        <a
          className="justify-around"
          onClick={() => onSetPositionIndex(positionIndex - 1)}
        >
          <IconChevronsUp className="h-5 w-5" />
        </a>
      </li>

      <li className={positionIndex >= positions.length - 1 ? "disabled" : ""}>
        <a
          className="justify-around"
          onClick={() => onSetPositionIndex(positionIndex + 1)}
        >
          <IconChevronsDown className="h-5 w-5" />
        </a>
      </li>
    </>
  );
}

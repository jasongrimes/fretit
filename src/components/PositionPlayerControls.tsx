import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChartGridDots,
  IconChevronsDown,
  IconChevronsUp,
  IconCircleFilled,
  IconCircleLetterC,
  IconCircleLetterR,
  IconCircleNumber1,
  IconInfoCircle,
  IconKey,
  IconSettings,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useState } from "react";
import {
  ChordGrip,
  FretboardLabeler,
  LabelingScheme,
} from "../services/fretboard";

interface Props {
  onStrum: () => void;
  soundEnabled: boolean;
  onSetSoundEnabled: (enabled: boolean) => void;
  labeler: FretboardLabeler;
  onSetLabelingScheme: (scheme: LabelingScheme) => void;
  onMuteAllStrings: () => void;
  grips: ChordGrip[];
  onSetGrip: (grip: string) => void;
  currentGrip: ChordGrip;
}
export default function PositionPlayerControls({
  onStrum,
  soundEnabled,
  onSetSoundEnabled,
  labeler,
  onSetLabelingScheme,
  onMuteAllStrings,
  grips,
  onSetGrip,
  currentGrip,
}: Props) {
  const [maximized, setMaximized] = useState(false);

  function handleToggleMaximized() {
    setMaximized(!maximized);
  }

  function handleSoundClick() {
    onSetSoundEnabled(!soundEnabled);
  }
  function handleStrumClick() {
    onStrum();
  }

  const labelerIcons = {
    pitchClass: <IconCircleLetterC className="h-5 w-5" />,
    // prettier-ignore
    pitch: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372m218-572.1h-50.4c-4.4 0-8 3.6-8 8v384.2c0 4.4 3.6 8 8 8H730c4.4 0 8-3.6 8-8V319.9c0-4.4-3.6-8-8-8m-281.4 49.6c49.5 0 83.1 31.5 87 77.6c.4 4.2 3.8 7.4 8 7.4h52.6c2.4 0 4.4-2 4.4-4.4c0-81.2-64-138.1-152.3-138.1C345.4 304 286 373.5 286 488.4v49c0 114 59.4 182.6 162.3 182.6c88 0 152.3-55.1 152.3-132.5c0-2.4-2-4.4-4.4-4.4h-52.7c-4.2 0-7.6 3.2-8 7.3c-4.2 43-37.7 72.4-87 72.4c-61.1 0-95.6-44.9-95.6-125.2v-49.3c.1-81.4 34.6-126.8 95.7-126.8" /></svg>,
    chordInterval: <IconCircleLetterR className="h-5 w-5" />,
    scaleInterval: <IconCircleNumber1 className="h-5 w-5" />,
    none: <IconCircleFilled className="h-5 w-5" />,
  };

  return (
    <div className={` ${maximized ? "w-16" : ""}`}>
      <ul className="menu rounded-box bg-base-200 text-base-content">
        <li>
          <a>
            <IconKey className="h-5 w-5" />C major
          </a>
        </li>

        <li>
          <a>
            <IconChevronsUp className="h-5 w-5" />
          </a>
        </li>
        <li>
          <a>Open (C)</a>
        </li>
        <li>
          <a>
            <IconChevronsDown className="h-5 w-5" />
          </a>
        </li>

        {/* Chord grips  */}
        {grips.map((grip) => {
          return (
            <li className="w-full" key={grip.name}>
              <a
                className={`block w-full truncate text-clip px-0 text-center text-accent ${
                  currentGrip.name === grip.name ? "active" : ""
                }`}
                onClick={() => onSetGrip(grip.name)}
              >
                {grip.name}
              </a>
            </li>
          );
        })}

        <li></li>

        <li>
          <a onClick={handleSoundClick}>
            {!soundEnabled ? (
              <IconVolumeOff className="h-5 w-5" />
            ) : (
              <IconVolume className="h-5 w-5" />
            )}
            <span className={maximized ? "hidden" : ""}>Sound</span>
          </a>
        </li>

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

        {/* Labeling scheme */}
        <li>
          <details className="dropdown dropdown-end">
            <summary className={maximized ? "gap-0 after:w-0" : ""}>
              {labelerIcons[labeler.scheme]}
              <span className={maximized ? "hidden" : ""}>Labels</span>
            </summary>
            <ul className="menu dropdown-content z-[10] w-52 rounded-box bg-base-100 p-2 shadow">
              <li className="menu-title">Note labels</li>
              <li>
                <a
                  className={labeler.scheme === "pitchClass" ? "active" : ""}
                  onClick={() => onSetLabelingScheme("pitchClass")}
                >
                  {labelerIcons.pitchClass}
                  Note name
                </a>
              </li>
              <li>
                <a
                  className={labeler.scheme === "pitch" ? "active" : ""}
                  onClick={() => onSetLabelingScheme("pitch")}
                >
                  {labelerIcons.pitch}
                  Note + octave
                </a>
              </li>
              <li>
                <a
                  className={labeler.scheme === "chordInterval" ? "active" : ""}
                  onClick={() => onSetLabelingScheme("chordInterval")}
                >
                  {labelerIcons.chordInterval}
                  Chord interval
                </a>
              </li>
              <li>
                <a
                  className={labeler.scheme === "scaleInterval" ? "active" : ""}
                  onClick={() => onSetLabelingScheme("scaleInterval")}
                >
                  {labelerIcons.scaleInterval}
                  Scale degree
                </a>
              </li>
              <li>
                <a
                  className={labeler.scheme === "none" ? "active" : ""}
                  onClick={() => onSetLabelingScheme("none")}
                >
                  {labelerIcons.none}
                  None
                </a>
              </li>
            </ul>
          </details>
        </li>

        <li>
          <a>
            <IconChartGridDots className="h-5 w-5" />
            Scale
          </a>
        </li>

        <li>
          <a>
            <IconSettings className="h-5 w-5" />
            Settings
          </a>
        </li>

        <li>
          <a>
            <IconInfoCircle className="h-5 w-5" />
            About
          </a>
        </li>

        {/* <li className="">
          <a onClick={handleStrumClick}>
            <IconMusicBolt className="h-5 w-5" />
            <span className={maximized ? "hidden" : ""}>Strum</span>
          </a>
        </li>

        <li className="">
          <a onClick={onMuteAllStrings}>
            <IconX className="h-5 w-5" />
            <span className={maximized ? "hidden" : ""}>Mute</span>
          </a>
        </li> */}
      </ul>
    </div>
  );
}

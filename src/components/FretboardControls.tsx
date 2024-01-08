import {
  IconChevronDown,
  IconChevronUp,
  IconCircleLetterA,
  IconClick,
  IconFolderOpen,
  IconMusicBolt,
  IconPhoto,
  IconPlaylist,
  IconPlaylistAdd,
  IconSettings,
  IconShare,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useState } from "react";
import { LabelerSettings, LabelingScheme } from "../services/fretboard";
// import { testSound, testSoundSimple } from "../util/testSound";
// import makePlayer, { SoundPlayer } from "../util/sound";

interface FretboardControlsProps {
  onStrum: () => void;
  muted: boolean;
  onSetMuted: (muted: boolean) => void;
  labelerSettings: LabelerSettings;
  onSetLabelingScheme: (scheme: LabelingScheme) => void;
}
export default function FretboardControls({
  onStrum,
  muted = false,
  onSetMuted,
  labelerSettings,
  onSetLabelingScheme,
}: FretboardControlsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedChords, setCollapsedChords] = useState(false);
  const [collapsedEdit, setCollapsedEdit] = useState(false);

  function handleToggleCollapsed() {
    setCollapsed(!collapsed);
  }

  function handleToggleCollapsedChords() {
    setCollapsedChords(!collapsedChords);
  }

  function handleToggleCollapsedEdit() {
    setCollapsedEdit(!collapsedEdit);
  }

  function handleSoundClick() {
    onSetMuted(!muted);
  }
  function handleStrumClick() {
    onStrum();
  }

  return (
    <div className={collapsed ? "w-16" : ""}>
      <ul className="menu rounded-box bg-base-200 text-base-content">
        {/* Play controls*/}
        <li>
          <a onClick={handleSoundClick}>
            {muted ? (
              <IconVolumeOff className="h-5 w-5" />
            ) : (
              <IconVolume className="h-5 w-5" />
            )}
            <span className={collapsed ? "hidden" : ""}>Sound</span>
          </a>
        </li>

        <li className="">
          <a onClick={handleStrumClick}>
            <IconMusicBolt className="h-5 w-5" />
            <span className={collapsed ? "hidden" : ""}>Strum</span>
          </a>
        </li>

        <li></li>

        {/* Chord chart controls  */}
        <li>
          <a className="text-gray-500" onClick={handleToggleCollapsedChords}>
            {collapsedChords ? (
              <IconChevronDown className="h-5 w-5" />
            ) : (
              <IconChevronUp className="h-5 w-5" />
            )}
            <span className={collapsed ? "hidden" : ""}>Diagrams</span>
          </a>
        </li>

        <li></li>

        {!collapsedChords && (
          <>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                C
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                Dm
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                Em
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                F
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                G
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                Am
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                Bdim
              </a>
            </li>
            <li className="w-full">
              <a className="block w-full truncate text-clip px-0 text-center text-accent">
                G7
              </a>
            </li>

            {!collapsedEdit && (
              <>
                <li>
                  <a>
                    <IconPlaylistAdd className="h-5 w-5" />
                    <span className={collapsed ? "hidden" : ""}>Add </span>
                  </a>
                </li>

                <li>
                  <a>
                    <IconPlaylist className="h-5 w-5" />
                    <span className={collapsed ? "hidden" : ""}>Arrange</span>
                  </a>
                </li>
              </>
            )}

            <li></li>
          </>
        )}

        <li>
          <a className="text-gray-500" onClick={handleToggleCollapsedEdit}>
            {collapsedEdit ? (
              <IconChevronDown className="h-5 w-5" />
            ) : (
              <IconChevronUp className="h-5 w-5" />
            )}
            <span className={collapsed ? "hidden" : ""}>Edit</span>
          </a>
        </li>

        <li></li>

        {!collapsedEdit && (
          <>
            <li>
              <a className="">
                <IconClick className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Pick</span>
              </a>
            </li>

            <li>
              {/* <a> */}
              {/* <IconCircleLetterR className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Labels <IconChevronDown className="inline w-3"/></span> */}
              <details className="dropdown dropdown-end">
                <summary className={collapsed ? "gap-0 after:w-0" : ""}>
                  <IconCircleLetterA className="h-5 w-5" />
                  <span className={collapsed ? "hidden" : ""}>Labels</span>
                </summary>
                <ul className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
                  <li>
                    <a
                      className={
                        labelerSettings.scheme === "none" ? "active" : ""
                      }
                      onClick={() => onSetLabelingScheme("none")}
                    >
                      None
                    </a>
                  </li>
                  <li>
                    <a
                      className={
                        labelerSettings.scheme === "pitchClass" ? "active" : ""
                      }
                      onClick={() => onSetLabelingScheme("pitchClass")}
                    >
                      Note name (C)
                    </a>
                  </li>
                  <li>
                    <a
                      className={
                        labelerSettings.scheme === "pitch" ? "active" : ""
                      }
                      onClick={() => onSetLabelingScheme("pitch")}
                    >
                      Note with octave (C4)
                    </a>
                  </li>
                  <li>
                    <a
                      className={
                        labelerSettings.scheme === "chordInterval"
                          ? "active"
                          : ""
                      }
                      onClick={() => onSetLabelingScheme("chordInterval")}
                    >
                      Chord interval (R..7)
                    </a>
                  </li>
                  <li>
                    <a
                      className={
                        labelerSettings.scheme === "scaleInterval"
                          ? "active"
                          : ""
                      }
                      onClick={() => onSetLabelingScheme("scaleInterval")}
                    >
                      Scale interval (1..7)
                    </a>
                  </li>
                </ul>
              </details>
              {/* </a> */}
            </li>

            <li></li>

            {/* <li>
          <a>
            <TrashIcon className="h-5 w-5" />
            <span className={collapsed ? "hidden" : ""}>Clear</span>
          </a>
        </li>

        <li></li> */}

            <li>
              <a>
                <IconSettings className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Settings</span>
              </a>
            </li>

            <li>
              <a>
                <IconFolderOpen className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Open</span>
              </a>
            </li>
            {/* <li>
              <a>
                <IconDeviceFloppy className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Save</span>
              </a>
            </li> */}
            <li>
              <a>
                <IconPhoto className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Export</span>
              </a>
            </li>
            <li>
              <a>
                <IconShare className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Share</span>
              </a>
            </li>
            <li></li>
          </>
        )}

        <li>
          <a className="text-gray-500" onClick={handleToggleCollapsed}>
            {collapsed ? (
              // prettier-ignore
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 icon-tabler-layout-sidebar-right-expand" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M15 4v16" /><path d="M10 10l-2 2l2 2" /></svg>
            ) : (
              <>
                {/* prettier-ignore */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 icon-tabler-layout-sidebar-right-collapse" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M15 4v16" /><path d="M9 10l2 2l-2 2" /></svg>
                Collapse
              </>
            )}
          </a>
        </li>
      </ul>
    </div>
  );
}

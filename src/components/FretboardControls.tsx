import {
  IconChevronDown,
  IconChevronUp,
  IconClick,
  IconDeviceFloppy,
  IconFolderOpen,
  IconMusicBolt,
  IconPhoto,
  IconPlaylist,
  IconPlaylistAdd,
  IconPointerPin,
  IconSettings,
  IconShare,
  IconVolume,
} from "@tabler/icons-react";
import { useState } from "react";

export default function FretboardControls() {
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

  return (
    <div className={collapsed ? "w-16" : ""}>
      <ul className="menu rounded-box bg-base-200 text-base-content">
        {/* Play controls*/}
        <li>
          <a>
            <IconVolume className="h-5 w-5" />
            <span className={collapsed ? "hidden" : ""}>Sound</span>
          </a>
        </li>

        <li className="">
          <a>
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
              <a className="active">
                <IconClick className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Pick</span>
              </a>
            </li>

            <li>
              <a>
                <IconPointerPin className="h-5 w-5" />
                <span className={collapsed ? "hidden" : ""}>Overlay</span>
              </a>
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

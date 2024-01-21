import { LabelingStrategy } from "@/types";
import { IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useRef } from "react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  keyLetter: string;
  keyAccidental: string;
  keyType: string;
  onSetKey: (keyLetter: string, keyAccidental: string, keyType: string) => void;
  chordLabeling: LabelingStrategy;
  onSelectChordLabeling: (labeling: LabelingStrategy) => void;
  scaleLabeling: LabelingStrategy;
  onSetScaleLabeling: (labeling: LabelingStrategy) => void;
}
export default function SettingsDialog({
  isOpen,
  onClose,
  isSoundEnabled,
  onToggleSound,
  keyLetter,
  keyAccidental,
  keyType,
  onSetKey,
  chordLabeling,
  onSelectChordLabeling,
  scaleLabeling,
  onSetScaleLabeling,
}: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current?.open && !isOpen) {
      dialogRef.current?.close();
    } else if (!dialogRef.current?.open && isOpen) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  function handleSelectChordLabeling(e: ChangeEvent<HTMLSelectElement>) {
    onSelectChordLabeling(e.target.value as LabelingStrategy);
  }

  function handleSelectScaleLabeling(e: ChangeEvent<HTMLSelectElement>) {
    onSetScaleLabeling(e.target.value as LabelingStrategy);
  }

  return (
    <dialog
      ref={dialogRef}
      id="settings-modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">Settings</h3>

        {/* Toggle sound */}
        <div className="form-control mt-4 max-w-fit">
          <label className="label cursor-pointer gap-4">
            <span className="label-text flex gap-2">
              {isSoundEnabled ? (
                <IconVolume className="h-5 w-5" />
              ) : (
                <IconVolumeOff className="h-5 w-5" />
              )}
              Enable sound
            </span>
            <input
              type="checkbox"
              className="toggle"
              checked={isSoundEnabled}
              onChange={onToggleSound}
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
              onChange={(e) => onSetKey(e.target.value, keyAccidental, keyType)}
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
            onChange={handleSelectChordLabeling}
            defaultValue={chordLabeling}
          >
            <option value="chordInterval">Chord intervals (R..7)</option>
            <option value="scaleInterval">Scale degrees (1..7)</option>
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
          <form method="dialog" onSubmit={onClose}>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      {/* there a second form with 'modal-backdrop' class and it covers the screen so we can close the modal when clicked outside */}
      <form method="dialog" className="modal-backdrop" onSubmit={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}

export type { Voicing } from "@/utils/chord-calculator";
export type {
  LabelingStrategy,
  StringOverlays,
} from "@/utils/fretboard-overlays";
export type { Instrument } from "@/utils/instruments";
export type { Key } from "@/utils/key";

// TODO: Maybe get rid of this type?
// It's only used in two places now,
// and it might be simpler to just specify the string and fret numbers explicitly.
export type FretboardLocation = [stringNum: number, fretNum: number];

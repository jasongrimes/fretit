export type { Voicing } from "@/utils/chord-calculator";
export type {
  LabelingStrategy,
  StringOverlays,
} from "@/utils/fretboard-overlays";
export type { Key } from "@/utils/key";

export interface Instrument {
  name: string;
  readonly tuning: number[];
  readonly fretMarkers: number[];
  readonly doubleFretMarkers: number[];
}

export type FretboardLocation = [stringNum: number, fretNum: number];

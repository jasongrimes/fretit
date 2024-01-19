export type { StringOverlays, LabelingStrategy } from "@/utils/fretboard-labeler";
export type { Key } from "@/utils/key";
export type { Voicing } from "@/utils/chord-calculator";

export interface Instrument {
  name: string;
  readonly tuning: number[];
  readonly fretMarkers: number[];
  readonly doubleFretMarkers: number[];
}

export type FretboardLocation = [stringNum: number, fretNum: number];

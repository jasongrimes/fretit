// Maps fret numbers to their overlay label and style.
export type StringOverlays = Record<number, { label: string; style?: string }>;

export interface Instrument {
  name: string;
  tuning: number[];
  fretMarkers: number[];
  doubleFretMarkers: number[];
}
export type FretboardLocation = [stringNum: number, fretNum: number];

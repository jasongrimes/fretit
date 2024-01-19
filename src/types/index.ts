// Maps fret numbers to their overlay label and style.
export type StringOverlays = Record<
  number,
  { label: string; type?: string; style?: string; isTransparent?: boolean }
>;

export interface Instrument {
  name: string;
  readonly tuning: number[];
  readonly fretMarkers: number[];
  readonly doubleFretMarkers: number[];
}

export type FretboardLocation = [stringNum: number, fretNum: number];

export interface Key {
  tonic: string;
  type: string;
  keySignature: string;
  scaleNotes: readonly string[];
  scaleChromas: number[];
  preferSharps: boolean;
}

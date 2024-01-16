import { Instrument } from "../util/fretboard";

export const INSTRUMENTS: Record<string, Instrument> = {
  Guitar: {
    name: "Guitar",
    tuning: [64, 59, 55, 50, 45, 40],
    fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
    doubleFretMarkers: [12, 24],
  },
};

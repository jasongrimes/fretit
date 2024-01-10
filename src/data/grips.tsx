import { ChordGrip } from "../services/fretboard";

// C-shape I chord (open position)
export const GRIPS_OPEN: ChordGrip[] = [
  {
    name: "C",
    root: "C",
    voicing: [0, 1, 0, 2, 3, -1],
  },
  {
    name: "Dm",
    root: "D",
    voicing: [1, 3, 2, 0, -1, -1],
  },
  {
    name: "Em",
    root: "E",
    voicing: [0, 0, 0, 2, 2, 0],
  },
  {
    name: "F",
    root: "F",
    voicing: [1, 1, 2, 3, 3, 1],
  },
  {
    name: "G",
    root: "G",
    voicing: [3, 0, 0, 0, 2, 3],
  },
  {
    name: "Am",
    root: "A",
    voicing: [0, 1, 2, 2, 0, -1],
  },
  {
    name: "B°",
    root: "B",
    voicing: [1, 0, -1, 0, 2, -1],
  },
  {
    name: "G7",
    root: "G",
    voicing: [1, 0, 0, 0, 2, 3],
  },
];
// A-shape I chord (III position)
export const GRIPS_III: ChordGrip[] = [
  {
    name: "C",
    root: "C",
    voicing: [3, 5, 5, 5, 3, -1],
  },
  {
    name: "Dm",
    root: "D",
    voicing: [-1, 3, 2, 3, 5, -1],
  },
  {
    name: "Em",
    root: "E",
    voicing: [3, 5, 4, 2, -1, -1],
  },
  {
    name: "F",
    root: "F",
    voicing: [5, 6, 5, 3, -1, -1],
  },
  {
    name: "G",
    root: "G",
    voicing: [3, 3, 4, 5, 5, 3],
  },
  {
    name: "Am",
    root: "A",
    voicing: [5, 5, 5, -1, -1, 5],
  },
  {
    name: "B°",
    root: "B",
    voicing: [-1, 3, 4, 3, 2, -1],
  },
  {
    name: "G7",
    root: "G",
    voicing: [-1, 3, 4, 3, -1, 3],
  },
];

// G-shape I chord (V position)
export const GRIPS_V: ChordGrip[] = [
  {
    name: "C",
    root: "C",
    voicing: [8, 5, 5, 5, 7, 8],
  },
  {
    name: "Dm",
    root: "D",
    voicing: [5, 6, 7, 7, 5, -1],
  },
  {
    name: "Em",
    root: "E",
    voicing: [-1, 5, 4, 5, 7, -1],
  },
  {
    name: "F",
    root: "F",
    voicing: [5, 6, 5, 7, 8, -1],
  },
  {
    name: "G",
    root: "G",
    voicing: [7, 8, 7, 5, -1, -1],
  },
  {
    name: "Am",
    root: "A",
    voicing: [5, 5, 5, 7, 7, 5],
  },
  {
    name: "B°",
    root: "B",
    voicing: [7, 6, 7, -1, -1, 7],
  },
  {
    name: "G7",
    root: "G",
    voicing: [7, 6, 7, 5, -1, -1],
  },
];

// E-shape I chord (VIII position)
export const GRIPS_VIII: ChordGrip[] = [
  {
    name: "C",
    root: "C",
    voicing: [8, 8, 9, 10, 10, 8],
  },
  {
    name: "Dm",
    root: "D",
    voicing: [10, 10, 10, -1, -1, 10],
  },
  {
    name: "Em",
    root: "E",
    voicing: [7, 8, 9, 9, 7, -1],
  },
  {
    name: "F",
    root: "F",
    voicing: [8, 10, 10, 10, 8, -1],
  },
  {
    name: "G",
    root: "G",
    voicing: [7, 8, 7, 9, 10, -1],
  },
  {
    name: "Am",
    root: "A",
    voicing: [8, 10, 9, 7, -1, -1],
  },
  {
    name: "B°",
    root: "B",
    voicing: [-1, -1, 10, 9, 8, 10],
  },
  {
    name: "G7",
    root: "G",
    voicing: [-1, 8, 10, 9, 10, -1],
  },
];
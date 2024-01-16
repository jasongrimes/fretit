import { describe, test, expect } from "vitest";
import { ChordCalculator } from "./chord-calculator";

describe("Getting chords in key", () => {
  test.each([
    ["C", "major", ["C", "Dm", "Em", "F", "G", "Am", "B°", "G7"]],
    ["G", "major", ["G", "Am", "Bm", "C", "D", "Em", "F#°", "D7"]],
    ["C", "minor", ["Cm", "D°", "Eb", "Fm", "Gm", "Ab", "Bb", "B°", "G", "G7"]]
  ])("%s %s has chords %o", (keyTonic, keyType, expected) => {
    const chordCalculator = new ChordCalculator({ keyTonic, keyType });
    expect(chordCalculator.getChordList().map((chord) => chord.name)).toStrictEqual(expected);
  });
});
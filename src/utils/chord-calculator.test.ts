import { describe, expect, test } from "vitest";
import { getChordList, getPositions } from "./chord-calculator";
import createKey from "./key";

describe("Getting chords in keys", () => {
  test.each([
    ["C", "major", ["C", "Dm", "Em", "F", "G", "Am", "B°", "G7"]],
    ["G", "major", ["G", "Am", "Bm", "C", "D", "Em", "F#°", "D7"]],
    ["C", "minor", ["Cm", "D°", "Eb", "Fm", "Gm", "Ab", "Bb", "B°", "G", "G7"]],
  ])("%s %s has chords %o", (keyTonic, keyType, expected) => {
    const key = createKey(keyTonic, keyType);
    expect(getChordList(key).map((chord) => chord.name)).toStrictEqual(
      expected,
    );
  });
});

describe("Getting positions in keys", () => {
  test.each([
    ["C", "major", 4, "IX", "D"],
    ["G", "major", 2, "VII", "C"],
    ["C", "minor", 3, "VII", "E"],
  ])(
    "%s %s position at index %d is %s (%s shape)",
    (keyTonic, keyType, index, roman, caged) => {
      const key = createKey(keyTonic, keyType);
      const positions = getPositions(key);
      const position = positions[index];
      expect(position).toBeDefined();
      expect(position.roman).toBe(roman);
      expect(position.caged).toBe(caged);
    },
  );
});

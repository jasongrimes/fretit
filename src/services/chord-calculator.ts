import { Key, Note } from "tonal";

/**
 * Chord voicing.
 * Zero-indexed array of strings with the fret number stopped on each.
 * -1 means muted.
 */
export type Voicing = number[];

/**
 * A map of roman-numeral chord numbers to their Voicings.
 */
export type DiatonicChords = Record<string, Voicing>;

export interface Position {
  /**
   * Integer number of the I chord position (i.e. the lowest fret number).
   * Note that some chords in the position may descend a fret (or two?) below this.
   */
  positionNum: number;
  /**
   * CAGED shape of the I chord.
   */
  caged: string;
  chords: DiatonicChords;
}

export interface PositionLabel {
  caged: string;
  num: number;
  roman: string;
  label: string;
}

// Chord voicings in each CAGED position in guitar standard tuning,
// in C major key.
// const cMajorPositions: Record<string, CagedPosition> = {
const cMajorPositions: Position[] = [
  {
    caged: "C",
    positionNum: 0, // Lowest fret
    chords: {
      I: [0, 1, 0, 2, 3, -1],
      ii: [1, 3, 2, 0, -1, -1],
      iii: [0, 0, 0, 2, 2, 0],
      IV: [1, 1, 2, 3, 3, 1],
      V: [3, 0, 0, 0, 2, 3],
      vi: [0, 1, 2, 2, 0, -1],
      "vii°": [1, 0, -1, 0, 2, -1],
      V7: [1, 0, 0, 0, 2, 3],
    },
  },
  {
    caged: "A",
    positionNum: 3,
    chords: {
      I: [3, 5, 5, 5, 3, -1],
      ii: [-1, 3, 2, 3, 5, -1],
      iii: [3, 5, 4, 2, -1, -1],
      IV: [5, 6, 5, 3, -1, -1],
      V: [3, 3, 4, 5, 5, 3],
      vi: [5, 5, 5, -1, -1, 5],
      "vii°": [-1, 3, 4, 3, 2, -1],
      V7: [-1, 3, 4, 3, -1, 3],
    },
  },
  {
    caged: "G",
    positionNum: 5,
    chords: {
      I: [8, 5, 5, 5, 7, 8],
      ii: [5, 6, 7, 7, 5, -1],
      iii: [-1, 5, 4, 5, 7, -1],
      IV: [5, 6, 5, 7, 8, -1],
      V: [7, 8, 7, 5, -1, -1],
      vi: [5, 5, 5, 7, 7, 5],
      "vii°": [7, 6, 7, -1, -1, 7],
      V7: [7, 6, 7, 5, -1, -1],
    },
  },
  {
    caged: "E",
    positionNum: 8,
    chords: {
      I: [8, 8, 9, 10, 10, 8],
      ii: [10, 10, 10, -1, -1, 10],
      iii: [7, 8, 9, 9, 7, -1],
      IV: [8, 10, 10, 10, 8, -1],
      V: [7, 8, 7, 9, 10, -1],
      vi: [8, 10, 9, 7, -1, -1],
      "vii°": [-1, -1, 10, 9, 8, 10],
      V7: [-1, 8, 10, 9, 10, -1],
    },
  },
  {
    caged: "D",
    positionNum: 10,
    chords: {
      I: [12, 13, 12, 10, -1, -1],
      ii: [10, 10, 10, 12, 12, 10],
      iii: [12, 12, 12, -1, -1, 12],
      IV: [13, 10, 10, 10, 12, 13],
      V: [10, 12, 12, 12, 10, -1],
      vi: [-1, 10, 9, 10, 12, -1],
      "vii°": [10, 12, 10, 9, -1, -1],
      V7: [10, 12, 10, 12, 10, -1],
    },
  },
];

// prettier-ignore
const romanPositions = ["O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// Map chord roman numerals to zero-indexed arabic numerals.
// prettier-ignore
const chordNumIndex: Record<string, Record<string, number >> = {
  major: { I: 0, ii: 1, iii: 2, IV: 3, V: 4, vi: 5, "vii°": 6, V7: 4 },
  minor: { i: 0, "ii°": 1, bIII: 2, iv: 3, v: 4, bVI: 5, bVII: 6, V7: 4 }
}

// prettier-ignore
const triadSuffixes: Record<string, Record<string, string>> = {
  major: { I: "", ii: "m", iii: "m", IV: "", V: "", vi: "m", "vii°": "°", V7: "7" },
  minor: { i: "m", "ii°": "°", bIII: "", iv: "m", v: "m", bVI: "", bVII: "", V7: "7" },
}

export class ChordCalculator {
  readonly keyTonic: string;
  readonly keyType: string;
  readonly scale: string[];

  constructor({
    keyTonic,
    keyType,
  }: {
    keyTonic: string;
    keyType: "major" | "minor";
  }) {
    this.keyTonic = keyTonic;
    this.keyType = keyType;
    this.scale =
      keyType === "major"
        ? Key.majorKey(keyTonic).scale.slice()
        : Key.minorKey(keyTonic).natural.scale.slice();
  }

  getChordRoot(chordNum: string) {
    return this.scale[chordNumIndex[this.keyType][chordNum]];
  }

  getChordName(chordNum: string) {
    return this.getChordRoot(chordNum) + triadSuffixes[this.keyType][chordNum];
  }

  getChordList() {
    return Object.keys(chordNumIndex[this.keyType]).map((roman) => {
      return {
        roman,
        root: this.getChordRoot(roman),
        name: this.getChordName(roman),
      };
    });
  }

  getPosition(positionIndex: number): Position {
    return this.getPositions()[positionIndex];
  }

  getPositions(): Position[] {
    return cMajorPositions
      .map((position) => {
        // Transpose the C Major positions to the current key.
        const keyChroma = Note.chroma(this.keyTonic) ?? 0;
        const transposedPosition = position.positionNum + keyChroma;
        const newPosition: Position = {
          ...position,
          positionNum: transposedPosition % 12,
          chords: {},
        };
        const positionOffset = transposedPosition - newPosition.positionNum;
        Object.keys(position.chords).forEach((roman) => {
          newPosition.chords[roman] = position.chords[roman].map((fretNum) => {
            if (fretNum === -1) {
              return fretNum;
            }
            return fretNum + keyChroma - positionOffset;
          });
        });

        return newPosition;
      })
      .sort((a, b) => {
        return a.positionNum - b.positionNum;
      });
  }

  getChordVoicing(positionIndex: number, roman: string) {
    return this.getPosition(positionIndex)?.chords[roman].slice();
  }

  getPositionLabels(): PositionLabel[] {
    return this.getPositions().map((position) => {
      const caged = position.caged;
      const num = position.positionNum;
      const roman = romanPositions[num];
      const label = roman === "O" ? "Open" : roman;
      return { caged, num, roman, label };
    });
  }
}

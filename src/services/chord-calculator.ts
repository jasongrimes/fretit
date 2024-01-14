import { Key, Note } from "tonal";

/**
 * Chord voicing. A zero-indexed array of strings with the fret number stopped on each.
 * -1 means muted.
 */
export type Voicing = number[];

/**
 * A map of roman-numeral chord numbers to their Voicings.
 */
export type DiatonicChords = Record<string, Voicing>;

/**
 * All diatonic chords in one fretboard position in the key of C.
 */
export interface PositionTemplate {
  positionNum: number;
  caged: string;
  chords: DiatonicChords;
}
/**
 * One fretboard position in a given key, hydrated from a PositionTemplate.
 */
export interface Position extends PositionTemplate {
  roman: string;
  label: string;
}

// Chord voicings in each CAGED position in C major key.
const cMajorPositions: PositionTemplate[] = [
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

// C minor position templates.
const cMinorPositions: PositionTemplate[] = [
  {
    caged: "C",
    positionNum: 0, // Lowest fret
    chords: {
      i: [-1, 1, 0, 1, 3, -1],
      "ii°": [1, 3, 1, 0, -1, -1],
      bIII: [3, 4, 3, 1, -1, -1],
      iv: [1, 1, 1, 3, 3, 1],
      v: [3, 3, 3, -1, -1, 3],
      bVI: [4, 1, 1, 1, 3, 4],
      bVII: [1, 3, 3, 3, 1, -1],
      "vii°": [1, 0, -1, 0, 2, -1],
      V: [3, 0, 0, 0, 2, 3],
      V7: [1, 0, 0, 0, 2, 3],
    },
  },
  {
    caged: "A",
    positionNum: 3,
    chords: {
      i: [3, 4, 5, 5, 3, -1],
      "ii°": [-1, 3, -1, 3, 5, 4],
      bIII: [3, 4, 3, 5, 6, -1],
      iv: [4, 6, 5, 3, -1, -1],
      v: [3, 3, 3, 5, 5, 3],
      bVI: [4, 4, 5, 6, 6, 4],
      bVII: [6, 3, 3, 3, 5, 6],
      "vii°": [-1, 3, 4, 3, 5, -1],
      V: [3, 3, 4, 5, 5, 3],
      V7: [3, 3, 4, 3, 5, 3],
    },
  },
  {
    caged: "G",
    positionNum: 5,
    chords: {
      i: [8, 8, 8, -1, -1, 8],
      "ii°": [-1, 6, 7, 6, 5, -1],
      bIII: [6, 8, 8, 8, 6, -1],
      iv: [-1, 6, 5, 6, 8, -1],
      v: [6, 8, 7, 5, -1, -1],
      bVI: [8, 9, 8, 6, -1, -1],
      bVII: [6, 6, 7, 8, 8, 6],
      "vii°": [7, 6, 7, -1, -1, 7],
      V: [7, 8, 7, 5, -1, -1],
      V7: [7, 6, 7, 5, -1, -1],
    },
  },
  {
    caged: "E",
    positionNum: 8,
    chords: {
      i: [8, 8, 8, 10, 10, 8],
      "ii°": [10, 9, 10, -1, -1, 10],
      bIII: [11, 8, 8, 8, 10, 11],
      iv: [8, 9, 10, 10, 8, -1],
      v: [-1, 8, 7, 8, 10, -1],
      bVI: [8, 9, 8, 10, 11, -1],
      bVII: [10, 11, 10, 8, -1, -1],
      "vii°": [7, -1, 7, 9, 8, 7],
      V: [7, 8, 7, 9, 10, -1],
      V7: [-1, 8, 10, 9, 10, -1],
    },
  },
  {
    caged: "D",
    positionNum: 10,
    chords: {},
  },
];

// A few alternate voicings for open positions, by key tonic and chord number.
const openPositionVoicings: Record<string, DiatonicChords> = {
  A: {
    ii: [2, 3, 4, 4, 2, -1], // Bm
    iii: [0, 2, 1, 2, -1, -1], // C#m
    "vii°": [-1, 0, 1, 0, 2, -1], // G#dim
    V7: [0, 0, 1, 0, 2, 0], // E7
  },
  G: {
    iii: [2, 3, 4, 4, 2, -1], // Bm
  },
  E: {
    iii: [-1, 0, 1, 1, 2, 4], // G#m
    V: [2, 4, 4, 4, 2, -1], // B
    vi: [0, 2, 1, 2, -1, -1], // C#m
    V7: [2, 0, 2, 1, 2, -1], // B7
  },
  D: {
    vi: [2, 3, 4, 4, 2, -1], // Bm
    "vii°": [0, 2, 0, 2, -1, -1], // C#dim
  },
};

// prettier-ignore
const romanPositions = ["O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// Map chord roman numerals to zero-indexed arabic numerals.
// prettier-ignore
const chordNumIndex: Record<string, Record<string, number >> = {
  major: { I: 0, ii: 1, iii: 2, IV: 3, V: 4, vi: 5, "vii°": 6, V7: 4 },
  minor: { i: 0, "ii°": 1, bIII: 2, iv: 3, v: 4, bVI: 5, bVII: 6, "vii°": 7, V: 4, V7: 4 }
}

// prettier-ignore
const triadSuffixes: Record<string, Record<string, string>> = {
  major: { I: "", ii: "m", iii: "m", IV: "", V: "", vi: "m", "vii°": "°", V7: "7" },
  minor: { i: "m", "ii°": "°", bIII: "", iv: "m", v: "m", bVI: "", bVII: "", "vii°": "°", V: "", V7: "7" },
}

export class ChordCalculator {
  keyTonic!: string;
  keyType!: string;
  scale!: string[];

  constructor({
    keyTonic,
    keyType,
  }: {
    keyTonic: string;
    keyType: string; // "major" | "minor";
  }) {
    this.setKey(keyTonic, keyType);
  }

  setKey(keyTonic: string, keyType: string) {
    this.keyTonic = keyTonic;
    this.keyType = keyType;
    this.scale =
      keyType === "major"
        ? Key.majorKey(keyTonic).scale.slice()
        : [
            ...Key.minorKey(keyTonic).natural.scale,
            // Tack on the 7 from the harmonic minor
            Key.minorKey(keyTonic).harmonic.scale[6],
          ];
  }

  getChordRoot(romanNum: string) {
    return this.scale[chordNumIndex[this.keyType][romanNum]];
  }

  getChordName(romanNum: string) {
    return this.getChordRoot(romanNum) + triadSuffixes[this.keyType][romanNum];
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
    const positions =
      this.keyType === "minor" ? cMinorPositions : cMajorPositions;
    return positions
      .map((position) => {
        // Transpose the C Major positions to the current key.
        const keyChroma = Note.chroma(this.keyTonic) ?? 0;
        const cPositionNum = position.positionNum ?? 0;
        const transposedPosition = cPositionNum + keyChroma;
        const newPositionNum = transposedPosition % 12;
        const positionOffset = transposedPosition - newPositionNum;
        const roman = romanPositions[newPositionNum];
        const newPosition: Position = {
          ...position,
          positionNum: newPositionNum,
          roman: roman,
          label: roman === "O" ? "Open" : roman,
          chords: {},
        };
        Object.keys(position.chords).forEach((roman) => {
          // In open position, check if there's an alternate voicing for this chord (by key and chord num)
          if (
            newPositionNum === 0 &&
            openPositionVoicings[this.keyTonic]?.[roman]
          ) {
            newPosition.chords[roman] =
              openPositionVoicings[this.keyTonic][roman];
          } else {
            newPosition.chords[roman] = position.chords[roman].map(
              (fretNum) => {
                if (fretNum === -1) {
                  return fretNum;
                }
                return fretNum + keyChroma - positionOffset;
              },
            );
          }
        });

        return newPosition;
      })
      .sort((a, b) => {
        return a.positionNum - b.positionNum;
      });
  }

  getChordVoicing(positionIndex: number, romanNum: string) {
    // console.log(`getChordVoicing(${positionIndex}, ${romanNum})`);
    return this.getPosition(positionIndex).chords[romanNum].slice();
  }
}

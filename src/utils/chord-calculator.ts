import { Key } from "@/types";
import { Note } from "tonal";

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
    positionNum: 2,
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
    positionNum: 4,
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
    positionNum: 7,
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
    positionNum: 9,
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
    positionNum: 7,
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
    positionNum: 9,
    chords: {
      i: [11, 13, 12, 10, -1, -1],
      "ii°": [10, -1, 10, 12, 11, 10],
      bIII: [11, 11, 12, 13, 13, 11],
      iv: [13, 13, 13, -1, -1, 13],
      v: [10, 11, 12, 12, 10, -1],
      bVI: [11, 13, 13, 13, 11, -1],
      bVII: [10, 11, 10, 12, 13, -1],
      "vii°": [10, 12, 10, 9, -1, -1],
      V: [10, 12, 12, 12, 10, -1],
      V7: [10, 12, 10, 12, 10, -1],
    },
  },
];

// A few alternate voicings for open positions, by key tonic and chord number.
const openPositionVoicings: Record<string, DiatonicChords> = {
  C: {
    "vii°": [-1, 3, 4, 3, 2, -1], // Bdim
  },
  A: {
    "ii°": [-1, 3, 4, 3, 2, -1], // Bdim
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
    "vii°": [-1, -1, 2, 1, 0, 2], // D#dim
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

export function getPositions(key: Key): Position[] {
  const positions = key.type === "minor" ? cMinorPositions : cMajorPositions;
  return positions
    .map((position) => {
      return hydratePosition(position, key);
    })
    .sort((a, b) => {
      return a.positionNum - b.positionNum;
    });
}

// Convert a PositionTemplate to a Position in a given key.
function hydratePosition(position: PositionTemplate, key: Key): Position {
  const keyChroma = Note.chroma(key.tonic) ?? 0;
  const cPositionNum = position.positionNum ?? 0;
  // Move the new position up the neck by the required number of semitones for the new key,
  // wrapping around if it goes above the 12th fret.
  let newPositionNum = (cPositionNum + keyChroma) % 12;
  // If the key has a special open-position voicing, use that instead of the 11th position.
  if (newPositionNum === 11 && openPositionVoicings[key.tonic]) {
    newPositionNum = 0;
  }
  // Track whether we dropped down an octave.
  const octaveOffset = (cPositionNum + keyChroma) !== newPositionNum ? 12 : 0;
  // Set the roman numeral for the new position.
  const roman = romanPositions[newPositionNum];
  // Create the new position
  const newPosition: Position = {
    ...position,
    positionNum: newPositionNum,
    roman: roman,
    label: roman === "O" ? "Open" : roman,
    chords: {},
  };
  // Transpose each fret number in each chord voicing.
  Object.keys(position.chords).forEach((roman) => {
    if (newPositionNum === 0 && openPositionVoicings[key.tonic]?.[roman]) {
      newPosition.chords[roman] = openPositionVoicings[key.tonic][roman];
    } else {
      newPosition.chords[roman] = position.chords[roman].map((fretNum) => {
        // If string is muted (-1), don't transpose it.
        if (fretNum === -1) {
           return fretNum;
        }
        // return fretNum + keyChroma - octaveOffset;
        return fretNum + keyChroma - octaveOffset;
      });
    }
  });

  return newPosition;
}

export function getChordList(key: Key) {
  return Object.keys(chordNumIndex[key.type]).map((roman) => {
    return {
      roman,
      root: getChordRoot(key, roman),
      name: getChordName(key, roman),
    };
  });
}

export function getChordRoot(key: Key, roman: string) {
  return key.scaleNotes[chordNumIndex[key.type][roman]];
}

function getChordName(key: Key, roman: string) {
  return getChordRoot(key, roman) + triadSuffixes[key.type][roman];
}

export function getChordVoicing(
  key: Key,
  positionIndex: number,
  roman: string,
) {
  return getPosition(key, positionIndex).chords[roman].slice();
}

function getPosition(key: Key, positionIndex: number): Position {
  return getPositions(key)[positionIndex];
}

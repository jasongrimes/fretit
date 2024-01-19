import { Note, Key as TonalKey } from "tonal";

export interface Key {
  tonic: string;
  type: string;
  keySignature: string;
  scaleNotes: readonly string[];
  scaleChromas: number[];
  preferSharps: boolean;
}

export default function createKey(keyTonic: string, keyType: string): Key {
  const scaleNotes =
    keyType === "major"
      ? TonalKey.majorKey(keyTonic).scale.slice()
      : [
          ...TonalKey.minorKey(keyTonic).natural.scale,
          // Tack on the 7 from the harmonic minor
          TonalKey.minorKey(keyTonic).harmonic.scale[6],
        ];
  const keySignature =
    keyType === "minor"
      ? TonalKey.minorKey(keyTonic).keySignature
      : TonalKey.majorKey(keyTonic).keySignature;

  return {
    tonic: keyTonic,
    type: keyType,
    keySignature: keySignature,
    scaleNotes: scaleNotes,
    scaleChromas: scaleNotes.map((note) => Note.chroma(note) ?? 0),
    preferSharps: !keySignature || keySignature.startsWith("#"),
  };
}

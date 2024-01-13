import { Interval, Note } from "tonal";

//
// Types
//
export interface Instrument {
  name: string;
  tuning: number[];
  fretMarkers: number[];
  doubleFretMarkers: number[];
}

export interface FretboardSettings {
  instrument: string;
  lowestFret: number;
  highestFret: number;
  labeling: LabelingScheme;
  preferSharps: boolean;
}

export type LabelingScheme =
  | "none"
  | "pitch"
  | "pitchClass"
  | "chordInterval"
  | "scaleInterval";

export interface ChordGrip {
  name: string;
  root?: string;
  voicing: number[];
}

export type FretboardLocation = [stringNum: number, fretNum: number];

/**
 * Fretboard labeler
 */
export class FretboardLabeler {
  tuning: number[];
  scheme: LabelingScheme;
  root?: string;
  tonic: string;
  preferSharps: boolean;

  constructor({
    tuning,
    labelingScheme,
    tonic,
    root,
    preferSharps,
  }: {
    tuning: number[];
    labelingScheme: LabelingScheme;
    tonic: string;
    root?: string;
    preferSharps: boolean;
  }) {
    this.tuning = tuning;
    this.scheme = labelingScheme;
    this.root = root;
    this.tonic = tonic;
    this.preferSharps = preferSharps;
  }

  getLocationLabel(location: FretboardLocation): string {
    const midi = this.getLocationMidi(location);

    return this.getMidiLabel(midi, this.scheme);
  }

  getMidiLabel(midi: number, scheme: LabelingScheme) {
    switch (scheme) {
      case "pitch":
        return this.getMidiPitch(midi);
      case "pitchClass":
        return Note.pitchClass(this.getMidiPitch(midi));
      case "scaleInterval":
      case "chordInterval": {
        const refPitchClass =
          scheme === "chordInterval" ? this.root : this.tonic;
        if (!refPitchClass) {
          return "";
        }

        const refMidi = Note.midi(refPitchClass + 1) ?? 0; // Ex. C1
        const semitones = (midi - refMidi) % 12;
        const interval = Interval.get(Interval.fromSemitones(semitones));
        if (midi === 61 || midi === 59) {
          //console.log(`getMidiLabel(${midi}): chroma, refChroma, semitones, interval`, chroma, refChroma, semitones, interval);
        }
        let intervalName = `${
          interval.alt === -1 ? "b" : interval.alt === 1 ? "#" : ""
        }${interval.simple === 8 ? 1 : interval.simple}`;
        if (scheme === "chordInterval" && intervalName === "1") {
          intervalName = "R";
        }
        return intervalName;
      }
      default:
        return "";
    }
  }

  getMidiPitch(midi: number) {
    return this.preferSharps ? Note.fromMidiSharps(midi) : Note.fromMidi(midi);
  }

  getLocationPitch(location: FretboardLocation) {
    return this.getMidiPitch(this.getLocationMidi(location));
  }

  getLocationPitchClass(location: FretboardLocation) {
    return Note.pitchClass(this.getLocationPitch(location));
  }

  getLocationStyle(location: FretboardLocation) {
    if (this.root === this.getLocationPitchClass(location)) {
      return "root";
    }
    return;
  }

  getLocationMidi([stringNum, fretNum]: FretboardLocation) {
    if (stringNum > this.tuning.length) {
      return 0;
    }
    return this.tuning[stringNum - 1] + fretNum;
  }

  /*
  createMatrix(numFrets: number):undefined[][] {
    return Array.from(this.tuning, () => Array<undefined>(numFrets));
  }

  createMatrixWith<Type>(fn: (note: {midi: number, chroma: number}) => Type, numFrets = 13): (Type)[][] {
    const matrix: (Type | undefined)[][] = this.createMatrix(numFrets);
    
    this.tuning.forEach((stringMidi, stringIndex) => {
      for (let fret = 0; fret <= numFrets; fret++) {
        const midi = stringMidi + fret;
        const chroma = midi % 12;
        matrix[stringIndex][fret] = fn({ midi, chroma });
      }
    });

    return matrix as Type[][];
  }
  */
/*
  getMidiLocations(midiNum: number, minFret = 0, maxFret = 13) {
    const locations: FretboardLocation[] = [];

    this.tuning.forEach((stringMidi, stringIndex) => {
      for (let fret = minFret; fret <= maxFret; fret++) {
        const midi = stringMidi + fret;
        if (midi === midiNum) {
          locations.push([stringIndex + 1, fret]);
        }
      }
    });

    return locations;
  }

  getPitchClassLocations(pitchClass: string, minFret = 0, maxFret = 13) {
    const locations: FretboardLocation[] = [];

    this.tuning.forEach((stringMidi, stringIndex) => {
      for (let fret = minFret; fret <= maxFret; fret++) {
        const midi = stringMidi + fret;
        if (midi === midiNum) {
          locations.push([stringIndex + 1, fret]);
        }
      }
    });

    return locations;
  }
  */
}

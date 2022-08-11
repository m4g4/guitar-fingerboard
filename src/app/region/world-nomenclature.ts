import { RegionNomenclature } from './region-nomenclature';

export class WorldNomenclature extends RegionNomenclature {

    getRegion() { return "World"; }

    getMusicalAlphabetSharps(): string[] {
        return ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    }
    getMusicalAlphabetFlats(): string[] {
        return ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
    }

    getZeroFretTones(): string[] {
        return ["E", "B", "G", "D", "A", "E"];
    }
}

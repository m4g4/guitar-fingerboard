import { RegionNomenclature } from './region-nomenclature';

export class MiddleEuropeNomenclature extends RegionNomenclature {

    getRegion() { return "MidEu"; }

    getMusicalAlphabetSharps(): string[] {
        return ["A", "B", "H", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    }
    getMusicalAlphabetFlats(): string[] {
        return ["A", "B", "H", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
    }

    getZeroFretTones(): string[] {
        return ["E", "H", "G", "D", "A", "E"];
    }

}

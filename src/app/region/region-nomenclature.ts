export abstract class RegionNomenclature {

    abstract getRegion(): string;

    abstract getMusicalAlphabetSharps(): string[];
    abstract getMusicalAlphabetFlats(): string[];
    abstract getZeroFretTones(): string[];

    getSharpKeys(): string[] {
        return ["C", "G", "D", "A", "E", "B", "F#"];
    }

    getFlatKeys(): string[] {
        return ["F", "Bb", "Eb", "Ab", "Db"];
    }

    getFretToneOctaves(): number[] {
        return [4, 3, 3, 3, 2, 2];
    }
}

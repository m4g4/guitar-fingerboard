import { BehaviorSubject, Observable } from 'rxjs';

export type ToneIdType = string;

export interface DiplayTone {
    show?: null | string,
    tooltip?: null | string
}

export interface Sequence {
    displayTones: {[key: ToneIdType]: DiplayTone | string},
    displayTimeMs: number
}

export class GuitarTonesService {

    private displayTones$ = new BehaviorSubject<{[key: ToneIdType]: DiplayTone | string}>({});

    private _CONSTANTS = {
        WORLD: {
            TONE_SHARPS: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
            TONE_FLATS:  ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]
        },
        MIDDLE_EUROPE: {
            TONE_SHARPS: ["A", "B", "H", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
            TONE_FLATS: ["A", "B", "H", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]
        },

        KEYS_SHARP: ["C", "G", "D", "A", "E", "B", "F#"],
        KEYS_FLAT:  ["F", "Bb", "Eb", "Ab", "Db"],

        GUITAR_ZERO_FRET_TONES: ["E", "B", "G", "D", "A", "E"]
    }

    animate(sequences: Sequence[], animateIndex: number) {
        if (sequences.length === 0)
        return;
        if (animateIndex === sequences.length)
        animateIndex = 0;

        const sequence: Sequence = sequences[animateIndex];

        this.animateStep(sequence, () => {
            this.animate(sequences, animateIndex + 1);
        });
    }

    animateStep(sequence: Sequence, finished: () => void) {
        this.displayTones$.next(sequence.displayTones);
        setTimeout(() => {
            finished();
        }, sequence.displayTimeMs);
    }

    createToneSequences(tonesInOrder: {[key: ToneIdType]: DiplayTone | string}[], stepTimeMs: number): Sequence[] {
        return tonesInOrder
        .map(tones => {
            return {
                displayTones: tones,
                displayTimeMs: stepTimeMs
            }
        });
    }

    createSimpleToneSequences(tones: ToneIdType[], stepTimeMs: number, show?: string[] | null, tooltips?: string[] | null): Sequence[] {
        if (show && show.length != tones.length) {
            console.error("show array not of the same length as tones");
            return [];
        }

        if (tooltips && tooltips.length != tones.length) {
            console.error("tooltips array not of the same length as tones");
            return [];
        }

        return this.createToneSequences(tones.map((tone, index) => {
            return {
                [tone]: {
                    show: show ? show[index] : null,
                    tooltip: tooltips ? tooltips[index] : null
                }
            }
        }), stepTimeMs);
    }

    getDisplayTones(): Observable<{[key: ToneIdType]: DiplayTone | string}> {
        return this.displayTones$;
    }

    generateToneId(stringNumber: number, toneName: string) {
        return toneName + "[" + stringNumber  + "]";
    }

    getTone(fretNumber: number, stringZeroTone: string, key?: string) {

        let tones: string[] = this._CONSTANTS.WORLD.TONE_SHARPS;

        const keyName = key ? key : "C";
        if (this._CONSTANTS.KEYS_SHARP.indexOf(keyName) === -1)
        tones = this._CONSTANTS.WORLD.TONE_FLATS;

        const fretIndex = tones.indexOf(stringZeroTone);
        if (-1 === fretIndex) {
            console.error("Invalid zero tone " + stringZeroTone);
            return "";
        }

        const toneIndex = (fretIndex + fretNumber) % tones.length;
        return tones[toneIndex];
    }
}

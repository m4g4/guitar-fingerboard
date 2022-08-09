import { now } from 'tone';
import GuitarAcousticMp3 from 'tonejs-instrument-guitar-acoustic-mp3';

import { Utils } from './utils';

export class GuitarTonesService {

    private instrumentMp3Player: any;
    private instrumentMp3PlayerLoaded: boolean = false;
    private debouncePlay: Function;

    constructor() {
        const self = this;
        this.debouncePlay = Utils.debounce(
            (tonePitch: string, strumDown: boolean) => { self.playTones(tonePitch, strumDown); },
            100, true);
    }

    public CONSTANTS = {
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

        ZERO_FRET_TONES: ["E", "B", "G", "D", "A", "E"],
        ZERO_FRET_OCTAVES: [4, 3, 3, 3, 2, 2]
    }

    generateToneId(fretNumber: number, stringNumber: number, toneName: string) {
        return toneName + ":" + stringNumber  + ":" + fretNumber;
    }

    getToneDataFromId(toneId: string) {
        const data = toneId.split(':');
        return { toneName: data[0], stringNumber: parseInt(data[1]), fretNumber: parseInt(data[2]) };
    }

    getTonesByKey(key: string) {
        let tones: string[] = this.CONSTANTS.WORLD.TONE_SHARPS;

        if (this.CONSTANTS.KEYS_SHARP.indexOf(key) === -1)
            tones = this.CONSTANTS.WORLD.TONE_FLATS;

        return tones;
    }

    getTone(fretNumber: number, stringNumber: number, key?: string) {

        const keyName = key ? key : "C";
        const tones = this.getTonesByKey(keyName);

        const stringZeroTone = this.CONSTANTS.ZERO_FRET_TONES[stringNumber-1];
        const fretIndex = tones.indexOf(stringZeroTone);
        if (-1 === fretIndex) {
            throw new Error("Invalid zero tone " + stringZeroTone);
            return "";
        }

        const toneIndex = (fretIndex + fretNumber) % tones.length;
        return tones[toneIndex];
    }

    getFretNumberOfTone(stringNumber: number, toneName: string, key?: string): number {
        const keyName = key ? key : "C";
        const tones = this.getTonesByKey(keyName);

        const stringZeroTone = this.CONSTANTS.ZERO_FRET_TONES[stringNumber-1];
        const zeroToneIndex = tones.indexOf(stringZeroTone);

        const toneIndex = tones.indexOf(toneName);
        const fretNumber = toneIndex - zeroToneIndex;
        return fretNumber >= 0 ? fretNumber : 12 + fretNumber;
    }

    getTonePitch(fretNumber: number, stringNumber: number) {

        const toneName = this.getTone(fretNumber, stringNumber);
        const fretNumberOfC = this.getFretNumberOfTone(stringNumber, "C");

        const octave = this.CONSTANTS.ZERO_FRET_OCTAVES[stringNumber-1] +
            (fretNumber % 12 < fretNumberOfC ? 0 : 1) +
            (fretNumber >= 12 ? 1 : 0);

        return toneName + octave;
    }

    playToneSound(tonePitch: string[] | string, strumDown: boolean = false) {

        if (!this.instrumentMp3Player) {
            this.instrumentMp3Player = new GuitarAcousticMp3({
                onload: () => {
                    this.instrumentMp3PlayerLoaded = true;
                    this.debouncePlay(tonePitch, strumDown);
                }
            });
            this.instrumentMp3Player.toDestination();
        } else {
            if (!this.instrumentMp3PlayerLoaded)
                return;
            this.debouncePlay(tonePitch, strumDown);
        }
    }

    releaseToneSound(tonePitch: string[] | string) {
        if (!Array.isArray(tonePitch)) {
            this.instrumentMp3Player.triggerRelease(tonePitch, now());
        } else {
            tonePitch.forEach(p => {
                this.instrumentMp3Player.triggerRelease(tonePitch, now());
            });
        }
    }

    releaseAllTones() {
        this.instrumentMp3Player.releaseAll();
    }

    private playTones(pitches: string | string[], strumDown: boolean = false) {

        if (!Array.isArray(pitches)) {
            this.instrumentMp3Player.triggerAttack(pitches);
        } else {
            const nowValue = now();
            let delay = 0;
            pitches.forEach(p => {
                this.instrumentMp3Player.triggerAttack(p, nowValue + delay);
                if (strumDown)
                    delay += 0.5;
            });
        }
    }
}

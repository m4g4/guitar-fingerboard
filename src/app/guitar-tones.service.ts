import { Inject } from '@angular/core';
import { now } from 'tone';
import GuitarSampler from './guitar-sampler';

import { RegionNomenclature } from './region/region-nomenclature';
import { WorldNomenclature } from './region/world-nomenclature';
import { MiddleEuropeNomenclature } from './region/middle-europe-nomenclature';

import { Utils } from './utils';

enum Region {
    World,
    MidEu
}

export interface InitializeOptions {
    region: undefined | string;
    static_mp3_folder: undefined | string;
}

export class GuitarTonesService {

    private instrumentMp3Player: any;
    private instrumentMp3PlayerLoaded: boolean = false;

    private debouncePlay: Function;

    private nomenclature: RegionNomenclature;
    private worldNomenclature: WorldNomenclature = new WorldNomenclature();

    constructor() {
        const self = this;
        this.debouncePlay = Utils.debounce(
            (tonePitch: string, strumDown: boolean) => { self.playTones(tonePitch, strumDown); },
            100, true);

        this.nomenclature = new WorldNomenclature();
    }

    initialize(options?: InitializeOptions) {

        this.instrumentMp3PlayerLoaded = false;
        this.instrumentMp3Player = new GuitarSampler({
            mp3s_url_prefix: options ? options.static_mp3_folder : undefined,
            onload: () => {
                this.instrumentMp3Player.toDestination();
                this.instrumentMp3PlayerLoaded = true;
            }
        });

        if (options && options.region) {
            const region: Region = Region[options.region as keyof typeof Region];
            switch (region) {
                case Region.MidEu:
                    this.nomenclature = new MiddleEuropeNomenclature();
                    break;
                default:
                    this.nomenclature = new WorldNomenclature();
            }
        } else {
            console.log("Region has not been specified. Using World");
            this.nomenclature = new WorldNomenclature();
        }
    }

    getNomenclature(): RegionNomenclature {
        return this.nomenclature;
    }

    generateToneId(fretNumber: number, stringNumber: number, toneName: string) {
        return toneName + ":" + stringNumber  + ":" + fretNumber;
    }

    getToneDataFromId(toneId: string) {
        const data = toneId.split(':');
        return { toneName: data[0], stringNumber: parseInt(data[1]), fretNumber: parseInt(data[2]) };
    }

    getTonesByKey(key: string, nomenclature?: RegionNomenclature) {
        nomenclature = nomenclature || this.nomenclature;

        let tones: string[] = nomenclature.getMusicalAlphabetSharps();

        if (nomenclature.getSharpKeys().indexOf(key) === -1)
            tones = nomenclature.getMusicalAlphabetFlats();

        return tones;
    }

    getTone(fretNumber: number, stringNumber: number, key?: string, nomenclature?: RegionNomenclature) {

        nomenclature = nomenclature || this.nomenclature;

        const keyName = key ? key : "C";
        const tones = this.getTonesByKey(keyName, nomenclature);

        const stringZeroTone = nomenclature.getZeroFretTones()[stringNumber-1];
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

        const stringZeroTone = this.nomenclature.getZeroFretTones()[stringNumber-1];
        const zeroToneIndex = tones.indexOf(stringZeroTone);

        const toneIndex = tones.indexOf(toneName);
        const fretNumber = toneIndex - zeroToneIndex;
        return fretNumber >= 0 ? fretNumber : 12 + fretNumber;
    }

    getWorldTonePitch(fretNumber: number, stringNumber: number) {

        const toneName = this.getTone(fretNumber, stringNumber, "C", this.worldNomenclature);
        const fretNumberOfC = this.getFretNumberOfTone(stringNumber, "C");

        const octave = this.worldNomenclature.getFretToneOctaves()[stringNumber-1] +
            (fretNumber % 12 < fretNumberOfC ? 0 : 1) +
            (fretNumber >= 12 ? 1 : 0);

        return toneName + octave;
    }

    isGuitarInstrumentInitialized() {
        return this.instrumentMp3PlayerLoaded;
    }

    playToneSound(tonePitch: string[] | string, strumDown: boolean = false) {

        if (!this.instrumentMp3PlayerLoaded)
            throw new Error("Instrument has not been initialized yet");

        this.debouncePlay(tonePitch, strumDown);
    }

    releaseToneSound(tonePitch: string[] | string) {

        if (!this.instrumentMp3PlayerLoaded)
            throw new Error("Instrument has not been initialized yet");

        if (!Array.isArray(tonePitch)) {
            this.instrumentMp3Player.triggerRelease(tonePitch, now());
        } else {
            tonePitch.forEach(p => {
                this.instrumentMp3Player.triggerRelease(tonePitch, now());
            });
        }
    }

    releaseAllTones() {
        if (!this.instrumentMp3PlayerLoaded)
            throw new Error("Instrument has not been initialized yet");

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

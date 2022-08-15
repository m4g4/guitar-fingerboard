import { Injectable } from '@angular/core';

import { GuitarTonesService } from './guitar-tones.service';
import { SequenceEvent } from './sequencer.service';

enum State {
    Unknown,
    Bar,
    Space,
    Pause,
    Tone2Indexes,
    Tone,
}

export class TablatureReader {

    private static STRING_COUNT = 6;

    constructor() {}

    static read(guitarTonesService: GuitarTonesService, data: string): SequenceEvent[] {
        let lines: string[] = data.split('\n');

        lines = lines.reduce(
            (acc: string[], line: string) => [...acc, ...line.split(';')],
            []
        );

        if (lines.length < this.STRING_COUNT) {
            throw new Error("Cannot parse tablature. At least 6 rows is required, got " + lines.length);
        }

        const allowedCharactersToStart = ['|', '-']
            .concat(guitarTonesService.getNomenclature().getZeroFretTones());

        const tabLines: string[] = lines.filter(line => {
            return line.length > 0
                && allowedCharactersToStart.indexOf(line[0]) != -1
                && line.indexOf('-')
        });

        if (tabLines.length != this.STRING_COUNT) {
            throw new Error("Could not parse tablature. 6 tablature rows required.");
        }

        const result: SequenceEvent[] = [];

        let lastState: State = State.Unknown;
        let currentState: State = State.Unknown;
        let currentIndex = 0;

        while (true) {

            let finished = true;
            for ( let s = 0; s < this.STRING_COUNT; s++ ) {

                if (currentIndex >= tabLines[s].length)
                    continue;

                finished = false;

                if (tabLines[s][currentIndex] === "|") {
                    currentState = State.Bar;
                    break;
                }

                if (currentState === State.Unknown && tabLines[s][currentIndex] === "-") {
                    if (lastState === State.Space) {
                        currentState = State.Pause;
                    } else {
                        currentState = State.Space;
                    }
                }

                if (!isNaN(parseInt(tabLines[s][currentIndex]))) {
                    currentState = State.Tone;

                    if (!isNaN(parseInt(tabLines[s][currentIndex + 1]))) {
                        currentState = State.Tone2Indexes;
                    }
                }
            }

            if (finished)
                break;

            let event: null | SequenceEvent = null;

            switch (currentState) {
                case State.Bar:
                    break;
                case State.Space:
                    break;
                case State.Pause:
                    event = {};
                    break;
                case State.Tone:
                    event = {};

                    for ( let s = 0; s < this.STRING_COUNT; s++ ) {
                        if (currentIndex >= tabLines[s].length)
                            continue;

                        const num = parseInt(tabLines[s][currentIndex]);
                        if (!isNaN(num)) {
                            let fretNumber = parseInt(tabLines[s][currentIndex]);
                            const toneName = guitarTonesService.getTone(fretNumber, s + 1);
                            const toneId = guitarTonesService.generateToneId(fretNumber, s + 1, toneName);

                            event[toneId] = {};
                        }
                    }
                    break;
                case State.Tone2Indexes:
                    event = {};

                    for ( let s = 0; s < this.STRING_COUNT; s++ ) {
                        if (currentIndex >= tabLines[s].length)
                            continue;

                        let fretNumber: undefined | number;
                        let num = parseInt(tabLines[s][currentIndex]);
                        if (!isNaN(num) && !isNaN(parseInt(tabLines[s][currentIndex + 1]))) {
                            fretNumber = parseInt(tabLines[s].substring(currentIndex, 2));
                        } else {
                            num = parseInt(tabLines[s][currentIndex + 1]);
                            if (!isNaN(num)) {
                                fretNumber = num;
                            }
                        }

                        if (fretNumber) {
                            const toneName = guitarTonesService.getTone(fretNumber, s + 1);
                            const toneId = guitarTonesService.generateToneId(fretNumber, s + 1, toneName);

                            event[toneId] = {};
                        }
                    }
                    currentIndex++;
                    break;

                default:
                    console.log("Unknown state", currentState);
            }

            if (event) {
                result.push(event);
            }

            lastState = currentState;
            currentState = State.Unknown;
            currentIndex++;
        }

        return result;
    }
}

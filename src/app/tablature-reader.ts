import { Injectable } from '@angular/core';

import { GuitarTonesService } from './guitar-tones.service';
import { SequenceEvent } from './sequencer.service';

export class TablatureReader {

    private static STRING_COUNT = 6;

    constructor() {}

    static read(guitarTonesService: GuitarTonesService, data: string): SequenceEvent[] {
        const lines: string[] = data.split('\n');

        if (lines.length < this.STRING_COUNT) {
            throw new Error("Cannot parse tablature. At least 6 rows is required.")
        }

        const allowedCharactersToStart = ['|', '-']
            .concat(guitarTonesService.CONSTANTS.ZERO_FRET_TONES);

        const tabLines: string[] = lines.filter(line => {
            return line.length > 0
                && allowedCharactersToStart.indexOf(line[0]) != -1
                && line.indexOf('-')
        });

        if (tabLines.length != this.STRING_COUNT) {
            throw new Error("Could not parse tablature. 6 tablature rows required.");
        }

        const result: SequenceEvent[] = [];

        let lastEvent: SequenceEvent = {0:{}};
        let currentIndex = 0;

        while (true) {

            const event: SequenceEvent = {};

            let processed = false;
            let addEvent = false;
            for ( let s = 0; s < this.STRING_COUNT; s++ ) {
                if (currentIndex >= tabLines[s].length)
                    continue;

                processed = true;

                if (tabLines[s][currentIndex] === "|")
                    continue;

                addEvent = true;

                const num = parseInt(tabLines[s][currentIndex]);
                if (!isNaN(num)) {
                    let fretNumber = parseInt(tabLines[s][currentIndex]);

                    if (currentIndex + 1 < tabLines[s].length) {
                        const nextNum = parseInt(tabLines[s][currentIndex+1]);
                        if (!isNaN(nextNum))
                            fretNumber = parseInt(tabLines[s].substring(currentIndex, 2));
                    }

                    const toneName = guitarTonesService.getTone(fretNumber, s + 1);
                    const toneId = guitarTonesService.generateToneId(fretNumber, s + 1, toneName);

                    event[toneId] = {};
                }
            }

            if (!processed)
                break;

            if (addEvent) {
                // if the event is empty (no notes playing), and the next is not empty, skip to the next one
                if (Object.keys(event).length != 0 || Object.keys(lastEvent).length == 0) {
                    result.push(event);
                }

                lastEvent = event;
            }
            currentIndex++;
        }

        return result;
    }
}

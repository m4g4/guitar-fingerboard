import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnChanges } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';

import { SequencerService, SequenceEvent, ToneIdType, DisplayTone } from './sequencer.service';
import { TablatureReader } from './tablature-reader';
import { GuitarTonesService } from './guitar-tones.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [GuitarTonesService, SequencerService]
})
export class AppComponent implements AfterViewInit, OnChanges {

    @ViewChild('root')
    root: undefined | ElementRef;
    @Input() data: string = "|1-2-3---3|\n|------|\n|------|\n|------|\n|------|\n|1-2-3-4-3-2-1|"; // EXAMPLE
    //@Input() data: string = '[]';

    displayedTones$: Observable<SequenceEvent>;
    lastPlayedTones: {[key: string]: ToneIdType[]} = {};

    title = 'guitar-fingerboard';
    smallScreen: boolean = false;

    constructor(private guitarTonesService: GuitarTonesService,
        private sequencerService: SequencerService) {

        fromEvent(window, 'resize').pipe(
            debounceTime(1000),
        ).subscribe((event: Event) => {
            this.checkIfSmallScreen();
        });

        this.displayedTones$ = sequencerService.getDisplayTonesObservable();

        const self = this;
        this.displayedTones$.subscribe({
            next(sequenceEvent: SequenceEvent) {

                const tones: {[key: string]: ToneIdType[]} = Object.keys(sequenceEvent)
                    .map(key => guitarTonesService.getToneDataFromId(key))
                    .reduce((rv: {[key: string]: ToneIdType[]}, toneData) => {
                        rv[""+toneData.stringNumber] = rv[""+toneData.stringNumber] || [];
                        rv[""+toneData.stringNumber].push(guitarTonesService.getTonePitch(toneData.fretNumber, toneData.stringNumber));
                        return rv;
                    }, {});

                for (const [stringNumber, ts] of Object.entries(tones)) {
                    if (self.lastPlayedTones[stringNumber] && self.lastPlayedTones[stringNumber].length > 0) {
                        if (!sequencerService.isMuted())
                            guitarTonesService.releaseToneSound(self.lastPlayedTones[stringNumber]);
                        self.lastPlayedTones[stringNumber] = [];
                    }
                }

                const tonePitches: string[] = Object.values(tones).reduce((rv, ts) => {
                    rv.push(...ts);
                    return rv;
                }, []);

                if (!sequencerService.isMuted())
                    guitarTonesService.playToneSound(tonePitches);

                for (const [stringNumber, ts] of Object.entries(tones)) {
                    if (self.lastPlayedTones[stringNumber])
                        self.lastPlayedTones[stringNumber] = [...tones[stringNumber], ...self.lastPlayedTones[stringNumber]];
                    else
                        self.lastPlayedTones[stringNumber] = [...tones[stringNumber]];
                }
            }
        });

        sequencerService.getMutedObservable().subscribe({
            next(muted: boolean) {
                if (muted)
                    guitarTonesService.releaseAllTones();
            }
        });
    }

    ngAfterViewInit() {
        // FIXME: Postpone to prevent Angular error NG0100
        setTimeout(() => {
            this.checkIfSmallScreen();
            this.prepareDisplayTones();
        }, 100);
    }

    ngOnChanges() {
        this.prepareDisplayTones();
    }

    prepareDisplayTones() {
        // TODO parse data using tablature service and run animation
        let data: SequenceEvent[] = [];
        try {
            data = TablatureReader.read(this.guitarTonesService, this.data);
        } catch(e) {
            console.error("Cannot display guitar finger board. " +
                "Data cannot be translated according the proper interface.", this.data, e);
            return;
        }

        this.sequencerService.setSequence(data);
    }

    checkIfSmallScreen() {
        if (this.root) {
            this.smallScreen = this.root.nativeElement.offsetWidth < 768;
        }
    }
}

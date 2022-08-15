import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';

import { SequencerService, SequenceEvent, ToneIdType, DisplayTone } from './sequencer.service';
import { TablatureReader } from './tablature-reader';
import { GuitarTonesService } from './guitar-tones.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        GuitarTonesService,
        SequencerService
    ]
})
export class AppComponent implements AfterViewInit, OnInit {

    @ViewChild('root')
    root: undefined | ElementRef;
    //@Input() data: string = "|-------------------------------|--------------------------------||-------------------------------|--------------------------------||-------------------------------|--------------------------------||-------------------------------|--------------------------------|\n|--------3---------------3------|--------3--3--------------------||--------3---------------3------|--------3-----------------------||--------3---------------3------|--------3--3--------------------||--------3---------------3------|--------3--3--------------------|\n|----------2---------------0----|--------0--0----------------2p0-||----------2---------------0----|--------0--0--2p0-0-4p0--0-5/7--||----------2---------------0----|--------0--0----------------2p0-||----------2---------------0----|--------0--0----------------2p0-|\n|--0--0------0---------------0--|-------------------0-2p0--------||--0--0------0---------------0--|--------------------------------||--0--0------0---------------0--|-------------------0-2p0--------||--0--0------0---------------0--|-------------------0-2p0--------|\n|--------------3-0-3------------|--------------0h2--------2------||--------------3-0-3------------|--------------------------------||--------------3-0-3------------|--------------0h2--------2------||--------------3-0-3------------|--------------0h2--------2------|\n|-------------------------------|-3-0-3--------------------------||-------------------------------|-3-0-3--------------------------||-------------------------------|-3-0-3--------------------------||-------------------------------|-3-0-3--------------------------|";
    // Let Zeppeling - Starway to Heaven
    //@Input() data: string = "|-------5-7-----7-|-8-----8-2-----2-|-0---------0-----|-----------------||---------7-----7-|-8-----8-2-----2-|-0---------0-----|-----------------||-------0-2-----2-|-0-----0----------|---------3-----3-|-3p2-2-2---------||---------2-----2-|-0-----0----------|---------------2-|-0-0-0-----------|\n|-----5-----5-----|---5-------3-----|---1---1-----1---|-0-1-1-----------||-------5---5-----|---5-------3-----|---1---1-----1---|-0-1-1-----------||-----------3-----|---1-----0h1------|-1-----1---0-----|-----3-3---------||-------1---3-----|---1-----0h1------|-------1-----3---|-1-1-1-----------|\n|---5---------5---|-----5-------2---|-----2---------2-|-0-2-2---2-------||-----5-------5---|-----5-------2---|-----2---------2-|-0-2-2-----------||-----0-------2---|-----2-------2----|---0---------0---|-----2-2---------||-----0-------2---|-----2-------2----|-----0-----2-----|-2-2-2-----------|\n|-7-------6-------|-5-------4-------|-3---------------|-----------------||---7-----6-------|-5-------4-------|-3---------------|-----------------||---2-----0-------|-3----------------|-----2-----------|-0---0-0---------||---2-----0-------|-3----------------|---2-----0-------|-3-3-3-----------|\n|-----------------|-----------------|-----------------|-2-0-0---0--/8-7-||-0---------------|-----------------|-----------------|-2-0-0-------0-2-||-3---------------|---------0----0-2-|-3---------------|-------------0-2-||-3---------------|---------0----0-2-|-3---------------|-----------------|\n|-----------------|-----------------|-----------------|-----------------||-----------------|-----------------|-----------------|-----------------||-----------------|------------------|---------3-------|-----------------||-----------------|------------------|-----------------|-----------------|"; // EXAMPLE
    @Input() data: undefined | string;

    @Input() region: undefined | string;
    @Input() static_mp3_folder: undefined | string;

    displayedTones$: Observable<SequenceEvent>;
    lastPlayedTones: {[key: string]: ToneIdType[]} = {};

    title = 'guitar-fingerboard';
    smallScreen: boolean = false;

    errorMessage: undefined | string;

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
                        rv[""+toneData.stringNumber].push(guitarTonesService.getWorldTonePitch(toneData.fretNumber, toneData.stringNumber));
                        return rv;
                    }, {});

                for (const [stringNumber, ts] of Object.entries(tones)) {
                    if (self.lastPlayedTones[stringNumber] && self.lastPlayedTones[stringNumber].length > 0) {
                        if (!sequencerService.isMuted() && guitarTonesService.isGuitarInstrumentInitialized())
                            guitarTonesService.releaseToneSound(self.lastPlayedTones[stringNumber]);
                        self.lastPlayedTones[stringNumber] = [];
                    }
                }

                const tonePitches: string[] = Object.values(tones).reduce((rv, ts) => {
                    rv.push(...ts);
                    return rv;
                }, []);

                if (!sequencerService.isMuted() && guitarTonesService.isGuitarInstrumentInitialized()) {
                        guitarTonesService.playToneSound(tonePitches);
                }

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

    ngOnInit() {
        console.log("App component OnInit", this.region, this.static_mp3_folder);

        this.guitarTonesService.initialize({
            region: this.region,
            static_mp3_folder: this.static_mp3_folder
        });

        this.prepareDisplayTones();
    }

    prepareDisplayTones() {
        if (!this.data) {
            this.sequencerService.setSequence([]);
            return;
        }

        // TODO parse data using tablature service and run animation
        let data: SequenceEvent[] = [];
        try {
            data = TablatureReader.read(this.guitarTonesService, this.data);
        } catch(e) {
            this.errorMessage = "Cannot display guitar fretboard. Data not in a valid format."
            console.error(e, this.data);
            return;
        }

        console.log('Data', data);

        this.sequencerService.setSequence(data);
    }

    checkIfSmallScreen() {
        if (this.root) {
            this.smallScreen = this.root.nativeElement.offsetWidth < 750;
        }
    }
}

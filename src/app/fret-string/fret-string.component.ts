import { Component, OnChanges, Input } from '@angular/core';

import { DisplayTone } from '../sequencer.service'
import { GuitarTonesService } from '../guitar-tones.service'

@Component({
    selector: 'app-fret-string',
    templateUrl: './fret-string.component.html',
    styleUrls: ['./fret-string.component.scss']
})
export class FretStringComponent {
    @Input() stringLook: string = "sizeOne silver";
    @Input() fretNumber: number = -1;
    @Input() stringNumber: string | number = -1;

    toneId: string = "";
    toneName: string = "";
    tonePitch: string = "";

    constructor(private guitarTonesService: GuitarTonesService) {}

    ngOnChanges() {
        //if (this.fretNumber === -1)
        //    return;
        if (typeof this.stringNumber === 'string')
            this.stringNumber = parseInt(this.stringNumber);

        this.toneName = this.guitarTonesService.getTone(this.fretNumber, this.stringNumber, "C");
        this.toneId = this.guitarTonesService.generateToneId(this.fretNumber, this.stringNumber, this.toneName);
        this.tonePitch = this.guitarTonesService.getWorldTonePitch(this.fretNumber, this.stringNumber);
    }
}

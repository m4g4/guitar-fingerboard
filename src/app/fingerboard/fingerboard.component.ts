import { Component, Input } from '@angular/core';
import { SequenceEvent, DisplayTone } from '../sequencer.service';
import { GuitarTonesService } from '../guitar-tones.service';

@Component({
    selector: 'app-fingerboard',
    templateUrl: './fingerboard.component.html',
    styleUrls: ['./fingerboard.component.scss']
})
export class FingerboardComponent {

    fretClassNames = ["zero", "first", "second", "third", "fourth", "fifth", "sixth",
    "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];

    numberOfFrets: number = 13;
    frets: number[] = new Array(this.numberOfFrets);

    getFretClass(fretNumber: number) {
        if (fretNumber > 12) {
            throw new Error("Unknown fret number " + fretNumber);
        }
        return this.fretClassNames[fretNumber];
    }

}

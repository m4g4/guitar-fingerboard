import { Component, Input, OnChanges } from '@angular/core';
import { GuitarTonesService, ToneIdType, DiplayTone, Sequence } from '../guitar-tones.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-fingerboard',
    templateUrl: './fingerboard.component.html',
    styleUrls: ['./fingerboard.component.scss']
})
export class FingerboardComponent implements OnChanges {

    @Input() data: string = '';

    fretClassNames = ["zero", "first", "second", "third", "fourth", "fifth", "sixth",
    "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
    numberOfFrets: number = 13;
    frets: number[] = new Array(this.numberOfFrets);

    displayedTones$: Observable<{[key: ToneIdType]: DiplayTone | string}>;

    constructor(private guitarTonesService: GuitarTonesService) {
        this.displayedTones$ = guitarTonesService.getDisplayTones();
    }

    ngOnChanges() {
        let data: Sequence[] = [];
        try {
            data = JSON.parse(this.data);
        } catch(e) {
            console.error("Cannot display guitar finger board. Data cannot be translated according the proper interface.");
            console.error(this.data);
            console.error(e);
        }

        this.guitarTonesService.animate(data, 0);

        this.displayedTones$ = this.guitarTonesService.getDisplayTones();
    }

    getFretClass(fretNumber: number) {
        if (fretNumber > 12) {
            console.error("Unknown fret number " + fretNumber);
            return "";
        }
        return this.fretClassNames[fretNumber];
    }

}

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-fret',
    templateUrl: './fret.component.html',
    styleUrls: ['./fret.component.scss']
})
export class FretComponent {

    @Input() fretNumber: number = 0;

    shouldDisplayDot() {
        return this.fretNumber === 3 ||
        this.fretNumber === 5 ||
        this.fretNumber === 7 ||
        this.fretNumber === 9;
    }

    shouldDisplayDoubleDot() {
        return this.fretNumber === 12;
    }
}

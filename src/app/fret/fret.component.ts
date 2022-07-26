import { Component, Input } from '@angular/core';
import { ToneDisplayData } from '../fret-string/fret-string.component'
import { GuitarTonesService, ToneIdType, DiplayTone } from '../guitar-tones.service'

@Component({
    selector: 'app-fret',
    templateUrl: './fret.component.html',
    styleUrls: ['./fret.component.scss']
})
export class FretComponent {

    @Input() fretNumber: number = 0;
    @Input() displayedTones: null | {[key: ToneIdType]: DiplayTone | string} = null;

    constructor(private guitarTonesService: GuitarTonesService) {}

    shouldDisplayDot() {
        return this.fretNumber === 3 ||
        this.fretNumber === 5 ||
        this.fretNumber === 7 ||
        this.fretNumber === 9;
    }

    shouldDisplayDoubleDot() {
        return this.fretNumber === 12;
    }

    displayData(stringNumber: number, fretZeroTone: string): ToneDisplayData {
        const toneName: string = this.guitarTonesService.getTone(this.fretNumber, fretZeroTone, "C");
        const toneId: string = this.guitarTonesService.generateToneId(stringNumber, toneName);
        const displayedValue: null | DiplayTone | string = this.displayedTones ? this.displayedTones[toneId] : null;

        let show = toneName;
        let tooltip = null;
        if (displayedValue) {
            if (typeof displayedValue === "string") {
                show = displayedValue;
            } else if (typeof displayedValue === "object") {
                show = displayedValue.show ? displayedValue.show : toneName;
                tooltip = displayedValue.tooltip;
            }
        }

        return {
            toneId,
            show,
            tooltip,
            visible: displayedValue ? true : false
        }
    }
}

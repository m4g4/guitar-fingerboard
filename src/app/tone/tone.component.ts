import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { SequencerService, SequenceEvent, DisplayTone } from '../sequencer.service'
import { GuitarTonesService } from '../guitar-tones.service'

@Component({
  selector: 'app-tone',
  templateUrl: './tone.component.html',
  styleUrls: ['./tone.component.scss']
})
export class ToneComponent {
    @Input() toneId: string = "";
    @Input() toneName: string = "";
    @Input() tonePitch: string = "";
    tooltip?: string | null = null;
    pressed: boolean = false;
    customName: null | string = null;

    constructor(private guitarTonesService: GuitarTonesService,
        private sequencerService: SequencerService) {

        const self = this;
        sequencerService.getDisplayTonesObservable().subscribe({
            next(sequenceEvent: SequenceEvent) {
                const displayedValue: null | DisplayTone | string = sequenceEvent[self.toneId];

                if (displayedValue) {
                    if (typeof displayedValue === "string") {
                        self.customName = displayedValue;
                    } else if (typeof displayedValue === "object") {
                        self.customName = displayedValue.customName ? displayedValue.customName : "";
                        self.tooltip = displayedValue.tooltip;
                    }

                    self.pressed = true;
                } else {
                    self.pressed = false;
                }
            }
        });
    }

    mouseClick() {
        this.guitarTonesService.playToneSound(this.tonePitch);
    }
}

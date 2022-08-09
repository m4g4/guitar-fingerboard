import { Component } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

import { SequencerService } from '../sequencer.service';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent {

    tempo: number = 60;
    muted: boolean = false;

    constructor(private sequencerService: SequencerService) {
    }

    createTempoSliderOptions(): Options {
        return {
            floor: 20,
            ceil: 150
        };
    }

    onPreviousClick() {
        this.sequencerService.setPreviousStep();
    }

    onNextClick() {
        this.sequencerService.setNextStep();
    }

    onPlayPauseClick() {
        this.sequencerService.togglePlaying();
    }

    onMoveToBeginningClick() {
        this.sequencerService.goToBeginning();
    }

    isAtTheBeginning() {
        return this.sequencerService.isAtTheBeginning();
    }

    onMuteClick() {
        this.sequencerService.toggleMuted();
    }

    isMuted() {
        return this.sequencerService.isMuted();
    }

    tempoChanged() {
        this.sequencerService.setTempo(this.tempo);
    }

    isPlaying() {
        return this.sequencerService.isPlaying();
    }

}

import { Component, OnInit, Input } from '@angular/core';

export interface ToneDisplayData {
    toneId: string,
    show: string,
    tooltip?: null | string,
    visible: boolean
}

@Component({
    selector: 'app-fret-string',
    templateUrl: './fret-string.component.html',
    styleUrls: ['./fret-string.component.scss']
})
export class FretStringComponent {
    @Input() isZeroFret: boolean = true;
    @Input() stringLook: string = "sizeOne silver";
    @Input() displayData: ToneDisplayData = {toneId: "", show: "", visible: false};
}

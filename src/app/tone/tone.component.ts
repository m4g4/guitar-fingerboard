import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-tone',
  templateUrl: './tone.component.html',
  styleUrls: ['./tone.component.scss']
})
export class ToneComponent implements OnChanges {
    @Input() toneName: string = "";
    @Input() tooltip?: string | null = null;
    @Input() visible: boolean = false;
    toneDisplayedString: string = " ";

    ngOnChanges() {
        this.toneDisplayedString = this.visible ? this.toneName : "";
    }

    mouseOver() {
        if (this.visible)
            return;

        this.toneDisplayedString = this.toneName;
    }

    mouseOut() {
        if (this.visible)
            return;

        this.toneDisplayedString = " ";
    }
}

import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';

import { GuitarTonesService } from './guitar-tones.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [GuitarTonesService]
})
export class AppComponent implements AfterViewInit {

    @ViewChild('root')
    root: undefined | ElementRef;
    //@Input() data: string = '[{"displayTones": {"C[1]": "1"}, "displayTimeMs": 1000}, {"displayTones": {"C[2]": {}}, "displayTimeMs": 1000}]'; // EXAMPLE
    @Input() data: string = '[]';

    title = 'guitar-fingerboard';
    smallScreen: boolean = false;

    constructor() {
        fromEvent(window, 'resize').pipe(
            debounceTime(1000),
        ).subscribe((event: Event) => {
            this.checkIfSmallScreen();
        });
    }

    ngAfterViewInit() {
        // FIXME: Postpone checkIfSmallScreen to prevent Angular error NG0100
        setTimeout(() => {
            this.checkIfSmallScreen();
        }, 100);
    }

    checkIfSmallScreen() {
        if (this.root) {
            this.smallScreen = this.root.nativeElement.offsetWidth < 768;
        }
    }
}

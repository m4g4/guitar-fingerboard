import { NgModule, Injector, DoBootstrap, ApplicationRef, isDevMode } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FingerboardComponent } from './fingerboard/fingerboard.component';
import { FretComponent } from './fret/fret.component';
import { ToneComponent } from './tone/tone.component';
import { FretStringComponent } from './fret-string/fret-string.component';

@NgModule({
    declarations: [
        AppComponent,
        FingerboardComponent,
        FretComponent,
        ToneComponent,
        FretStringComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

    constructor(private injector: Injector) {}

    ngDoBootstrap(appRef: ApplicationRef) {
        if (isDevMode()) {
            appRef.bootstrap(AppComponent);
        } else {
            const el = createCustomElement(AppComponent, {
                injector: this.injector
            });

            customElements.define("guitar-fretboard", el);
        }
    }
}

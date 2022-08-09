import { NgModule, Injector, DoBootstrap, ApplicationRef, isDevMode } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AppComponent } from './app.component';
import { IconsModule } from './icons/icons.module';
import { FingerboardComponent } from './fingerboard/fingerboard.component';
import { FretComponent } from './fret/fret.component';
import { ToneComponent } from './tone/tone.component';
import { FretStringComponent } from './fret-string/fret-string.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';

@NgModule({
    declarations: [
        AppComponent,
        FingerboardComponent,
        FretComponent,
        ToneComponent,
        FretStringComponent,
        ControlPanelComponent
    ],
    imports: [
        BrowserModule,
        NgxSliderModule,
        IconsModule,
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

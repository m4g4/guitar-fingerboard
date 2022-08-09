import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Play, Pause, SkipForward, SkipBack, Rewind, Volume2, VolumeX } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Rewind,
    VolumeX,
    Volume2
};

@NgModule({
    imports: [
        FeatherModule.pick(icons)
    ],
    exports: [
        FeatherModule
    ]
})
export class IconsModule { }

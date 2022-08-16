import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Play, Pause, SkipForward, SkipBack, Rewind, Repeat, VolumeX } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Rewind,
    VolumeX,
    Repeat
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

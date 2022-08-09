import { TestBed } from '@angular/core/testing';

import { TablatureReader } from './tablature-reader';
import { GuitarTonesService } from './guitar-tones.service';

describe('TablatureReader', () => {

    let gts: GuitarTonesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GuitarTonesService]
        }).compileComponents();
        gts = TestBed.inject(GuitarTonesService);
    });

    it('should parse tablature', () => {
        const data: string = "|3-3|\n|---|\n|---|\n|---|\n|---|\n|---|";
        const result = TablatureReader.read(gts, data);
        expect(JSON.stringify(result)).toEqual(JSON.stringify([{"G:1:3": {}}, {"G:1:3": {}}]));
    });

    it('should skip one pause symbol \'-\'', () => {
        const data: string = "|-3-|\n|---|\n|---|\n|---|\n|---|\n|---|";
        const result = TablatureReader.read(gts, data);
        expect(JSON.stringify(result)).toEqual(JSON.stringify([{"G:1:3": {}}]));
    });

    it('should not skip one pause symbol \'-\'', () => {
        const data: string = "|3--3|\n|----|\n|----|\n|----|\n|----|\n|----|";
        const result = TablatureReader.read(gts, data);
        expect(JSON.stringify(result)).toEqual(JSON.stringify([{"G:1:3": {}}, {}, {"G:1:3": {}}]));
    });
});

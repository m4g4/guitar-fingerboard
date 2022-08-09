import { TestBed } from '@angular/core/testing';

import { GuitarTonesService } from './guitar-tones.service';

describe('GuitarTonesService', () => {
    let service: GuitarTonesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GuitarTonesService]
        }).compileComponents();
        service = TestBed.inject(GuitarTonesService);
    });

    it('should return E', () => {
        expect(service.getTone(0, 1, "C")).toEqual("E");
    });

    it('should return F', () => {
        expect(service.getTone(1, 1, "C")).toEqual("F");
    });

    it('should return D', () => {
        expect(service.getTone(10, 6, "C")).toEqual("D");
    });

    it('should return C#', () => {
        expect(service.getTone(4, 5, "G")).toEqual("C#");
    });

    it('should return F higher octave', () => {
        expect(service.getTone(13, 6, "C")).toEqual("F");
    });

    it('should return 0 fret number', () => {
        expect(service.getFretNumberOfTone(6, "E")).toEqual(0);
    });

    it('should return 1 fret number', () => {
        expect(service.getFretNumberOfTone(2, "C")).toEqual(1);
    });

    it('should return tone pitch C3', () => {
        expect(service.getTonePitch(3, 5)).toEqual("C3");
    });

    it('should return a correct tone pitch', () => {
        const tonePitches = [
            ['E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5'],
            ['B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4'],
            ['G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4'],
            ['D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4'],
            ['A2','A#2','B2','C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A4'],
            ['E2','F2','F#2','G2','G#2','A2','A#2','B2','C3','C#3','D3','D#3','E3'],
        ];
        for(let s = 6; s > 0; s--) {
            for (let f = 0; f < 12; f++) {
                expect(service.getTonePitch(f, s)).toEqual(tonePitches[s-1][f]);
            }
        }
    });
});

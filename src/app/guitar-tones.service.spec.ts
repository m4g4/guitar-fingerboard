import { TestBed } from '@angular/core/testing';

import { GuitarTonesService } from './guitar-tones.service';

describe('GuitarTonesService', () => {
    let service: GuitarTonesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GuitarTonesService);
    });
    
    it('should return E', () => {
        expect(service.getTone(0, "E", "C")).toEqual("E");
    });

    it('should return F', () => {
        expect(service.getTone(1, "E", "C")).toEqual("F");
    });

    it('should return D', () => {
        expect(service.getTone(10, "E", "C")).toEqual("D");
    });

    it('should return C#', () => {
        expect(service.getTone(4, "A", "G")).toEqual("C#");
    });
});

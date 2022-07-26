import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToneComponent } from './tone.component';

describe('ToneComponent', () => {
    let component: ToneComponent;
    let fixture: ComponentFixture<ToneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ToneComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ToneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

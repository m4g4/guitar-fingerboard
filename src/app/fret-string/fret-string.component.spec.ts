import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FretStringComponent } from './fret-string.component';

describe('FretStringComponent', () => {
    let component: FretStringComponent;
    let fixture: ComponentFixture<FretStringComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FretStringComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(FretStringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

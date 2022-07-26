import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerboardComponent } from './fingerboard.component';

describe('FingerboardComponent', () => {
    let component: FingerboardComponent;
    let fixture: ComponentFixture<FingerboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FingerboardComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(FingerboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

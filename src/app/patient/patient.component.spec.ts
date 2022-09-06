import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PatientComponent } from './patient.component';

describe('PatientComponent', () => {
    let component: PatientComponent;
    let fixture: ComponentFixture<PatientComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PatientComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                FormBuilder
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

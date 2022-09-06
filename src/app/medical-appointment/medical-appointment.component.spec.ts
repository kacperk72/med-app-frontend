import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MedicalAppointmentComponent } from './medical-appointment.component';

describe('MedicalAppointmentComponent', () => {
    let component: MedicalAppointmentComponent;
    let fixture: ComponentFixture<MedicalAppointmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MedicalAppointmentComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MedicalAppointmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

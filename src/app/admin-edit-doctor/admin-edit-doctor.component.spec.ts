import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminEditDoctorComponent } from './admin-edit-doctor.component';

describe('AdminEditDoctorComponent', () => {
    let component: AdminEditDoctorComponent;
    let fixture: ComponentFixture<AdminEditDoctorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminEditDoctorComponent],
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
        fixture = TestBed.createComponent(AdminEditDoctorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

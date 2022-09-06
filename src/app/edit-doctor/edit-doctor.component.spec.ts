import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditDoctorComponent } from './edit-doctor.component';

describe('EditDoctorComponent', () => {
    let component: EditDoctorComponent;
    let fixture: ComponentFixture<EditDoctorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditDoctorComponent],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                FormBuilder
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditDoctorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});

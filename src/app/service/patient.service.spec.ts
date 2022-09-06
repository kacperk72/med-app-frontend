import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PatientService } from './patient.service';

describe('PatientService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PatientService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
    });

    it('should be created', inject([PatientService], (service: PatientService) => {
        expect(service).toBeTruthy();
    }));
});

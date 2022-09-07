import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PatientService } from './patient.service';

describe('PatientService', () => {
    const url = `http://localhost:3001/pacient/getCities`;

    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PatientService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should get all cities', () => {
        const testCities = [ { city: 'Kraków' }, { city: 'Poznań' }, { city: 'Warszawa' } ];

        httpClient.get(url).subscribe(data => {
            expect(data).toEqual(testCities);
        });

        const req = httpTestingController.expectOne(url);
        req.flush(testCities);
        // httpTestingController.verify();
    });

    it('should be created', inject([PatientService], (service: PatientService) => {
        expect(service).toBeTruthy();
    }));
});

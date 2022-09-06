import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MedicalAppointmentService } from './medical-appointment.service';

describe('MedicalAppointmentService', () => {
    const url = `http://localhost:3001/pacient/getUser/test`;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    let service: MedicalAppointmentService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MedicalAppointmentService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = new MedicalAppointmentService(httpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get one user', () => {
        const testData = {
            user_id: '81bab2ae-0732-11ed-840d-6c24084f33b4',
            name: 'Jan',
            surname: 'Testowy'
        };

        httpClient.get(url).subscribe(data => {
            expect(data).toEqual(testData);
        });
        const req = httpTestingController.expectOne(url);
        req.flush(testData);
        httpTestingController.verify();
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });
});

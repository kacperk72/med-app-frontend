import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { EditDoctorService } from './edit-doctor.service';

describe('EditDoctorService', () => {
    const url = `http://localhost:3001/doctor`;
    const url2 = `http://localhost:3001/doctor/getOne/test2`;
    const url3 = `http://localhost:3001/doctor/getBookedTerms/81babdc9-0732-11ed-840d-6c24084f33b4`;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditDoctorService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', inject([EditDoctorService], (service: EditDoctorService) => {
        expect(service).toBeTruthy();
    }));

    it('should get one doctor', () => {
        const testData = {
            id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
            name: 'Janek',
            surname: 'Kowalsky',
            speciality: 'Gastrolog',
            city: 'Kraków'
        };

        httpClient.get(url2).subscribe(data => {
            expect(data).toEqual(testData);
        });
        const req = httpTestingController.expectOne(url2);
        req.flush(testData);
        httpTestingController.verify();
    });

    it('should get doctor terms', () => {
        const testData = [
            {
                id_wizyty: '1969796f-d85d-45fc-8220-6538c9747747',
                id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
                id_pacjenta: '8a5c03d9-9684-4161-a114-4b992203de8e',
                id_terminu: '5be2da0a-9690-4676-a910-fbb9ec578320',
                term_id: 39,
                reason_of_visit: 'mam horom curke'
            },
            {
                id_wizyty: '2fe53412-85b4-48a9-9b4b-1792203c61fc',
                id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
                id_pacjenta: '81bab2ae-0732-11ed-840d-6c24084f33b4',
                id_terminu: '5be2da0a-9690-4676-a910-fbb9ec578320',
                term_id: 38,
                reason_of_visit: 'wizyta kontrolna'
            },
            {
                id_wizyty: '3e69b072-aa9d-4ed0-a7fe-db342e8f0fdb',
                id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
                id_pacjenta: '81bab2ae-0732-11ed-840d-6c24084f33b4',
                id_terminu: '77511fcf-a927-4f6d-adce-0b0716673194',
                term_id: 31,
                reason_of_visit: 'ból brzucha'
            },
            {
                id_wizyty: 'd747518c-eb5b-4acf-a675-4193a955f99d',
                id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
                id_pacjenta: '6655714e-0733-11ed-840d-6c24084f33b4',
                id_terminu: '77511fcf-a927-4f6d-adce-0b0716673194',
                term_id: 29,
                reason_of_visit: 'ból brzucha po jedzeniu'
            },
            {
                id_wizyty: 'df3a4df4-0449-453f-8a9d-a90755f4a840',
                id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
                id_pacjenta: '81bab2ae-0732-11ed-840d-6c24084f33b4',
                id_terminu: '5be2da0a-9690-4676-a910-fbb9ec578320',
                term_id: 42,
                reason_of_visit: 'mam horom curkę'
            }
        ];
        httpClient.get(url3).subscribe(data => {
            expect(data).toEqual(testData);
        });

        const req = httpTestingController.expectOne(url3);

        expect(req.request.method).toEqual('GET');

        req.flush(testData);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });
});

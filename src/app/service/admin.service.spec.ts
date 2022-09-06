import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminService } from './admin.service';

describe('AdminService', () => {
    const url = `http://localhost:3001/doctor`;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AdminService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', inject([AdminService], (service: AdminService) => {
        expect(service).toBeTruthy();
    }));

    it('should get doctors data', inject([AdminService], (service: AdminService) => {
        const doctorsData = [
            {
                id_lekarza: '87baa4ef-0733-11ed-840d-6c24084f33b4',
                speciality: [ 'Neurolog', 'Psycholog' ],
                city: 'Kraków',
                user_id: '87baa4ef-0733-11ed-840d-6c24084f33b4',
                login: 'test4',
                password: 'test4',
                role: 'lekarz',
                name: 'Bob',
                surname: 'Bobson'
            },
            {
                id_lekarza: 'd50fb23b-e1d8-4053-b76b-aa43d0ff8ae0',
                speciality: [ 'Chirurg', 'Kardiolog' ],
                city: 'Poznań',
                user_id: 'd50fb23b-e1d8-4053-b76b-aa43d0ff8ae0',
                login: 'lekarz2',
                password: 'lekarz2',
                role: 'lekarz',
                name: 'Hans',
                surname: 'Kloc'
            },
            {
                id_lekarza: '81babdc9-0732-11ed-840d-6c24084f33b4',
                speciality: [ 'Gastrolog' ],
                city: 'Kraków',
                user_id: '81babdc9-0732-11ed-840d-6c24084f33b4',
                login: 'test2',
                password: 'test2',
                role: 'lekarz',
                name: 'Janek',
                surname: 'Kowalsky'
            },
            {
                id_lekarza: 'dea6044f-1232-11ed-9d99-6c24084f33b4',
                speciality: [ 'Neurolog' ],
                city: 'Warszawa',
                user_id: 'dea6044f-1232-11ed-9d99-6c24084f33b4',
                login: 'lekarz1',
                password: 'lekarz1',
                role: 'lekarz',
                name: 'Michał',
                surname: 'Nowak'
            }
        ];

        httpClient.get(url).subscribe(data => {
            expect(data).toEqual(doctorsData);
        });

        const req = httpTestingController.expectOne(url);

        expect(req.request.method).toEqual('GET');

        req.flush(doctorsData);
    }));

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });
});

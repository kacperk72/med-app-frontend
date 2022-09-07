import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterUser } from '../models/pacient-types';

import { RegisterService } from './register.service';

describe('RegisterService', () => {
    const url = `http://localhost:3001/user/register`;
    const testUser: RegisterUser = {
        id: '',
        name: 'Tester',
        surname: 'Testowy',
        login: 'TestUser',
        password: 'TestUser',
        role: 'pacjent'
    };
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RegisterService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', inject([RegisterService], (service: RegisterService) => {
        expect(service).toBeTruthy();
    }));

    it('should call POST method', inject([RegisterService],(service: RegisterService) => {
        const PostApiMethod = 'POST';

        service.registerUser(testUser).subscribe();

        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toBe(PostApiMethod);
        req.flush(null);
    }));

    it('should test POST method', () => {
        httpClient.post(url, testUser).subscribe();
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(testUser);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });
});

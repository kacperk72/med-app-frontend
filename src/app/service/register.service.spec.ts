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
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RegisterService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
    });

    it('should be created', inject([RegisterService], (service: RegisterService) => {
        expect(service).toBeTruthy();
    }));

    // it('should call correct url', inject([RegisterService],(service: RegisterService) => {
    //     service.registerUser(testUser).subscribe();

    //     const req = httpTestingController.expectOne(url);
    //     expect(req.request.url).toBe(url);
    //     req.flush(null);
    // }));


    
});

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
    const url = `http://localhost:3001/user/login`;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    const testUser: {login: string; password: string} = {
        login: 'test',
        password: 'test'
    };
    const testFakeUser: {login: string; password: string} = {
        login: 'abcd',
        password: 'abcd'
    };
    const errorResponseLogin = {
        status: 500,
        statusText: 'nieudana próba logowania'
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', inject([AuthService],(service: AuthService) => {
        expect(service).toBeTruthy();
    }));

    it('should call POST method', inject([AuthService],(service: AuthService) => {
        const PostApiMethod = 'POST';

        service.proceedLogin(testUser).subscribe();

        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toBe(PostApiMethod);
        req.flush(null);

        // httpTestingController.verify();
    }));

    it('should test HttpClient.post', () => {
        httpClient.post(url, {
            login: 'test',
            password: 'test'
        }).subscribe();
        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush({
            login: 'test',
            password: 'test'
        });
        // httpTestingController.verify();
    });

    it('should return error from logging', inject([AuthService],(service: AuthService) => {
        service.proceedLogin(testFakeUser).subscribe({
            error: (err) => {
                expect(err.message).toContain('nieudana próba logowania');
            }
        });
        const req = httpTestingController.expectOne(url);
        req.flush(testFakeUser, errorResponseLogin);
    }));

    it('should return error code 500 from logging', () => {
        const errmess = 'nieudana próba logowania';

        httpClient.post(url,{
            login: 'testZly',
            password: 'testZly'
        }).subscribe({
            error: (error: HttpErrorResponse) => {
                expect(error.status).withContext('status').toEqual(500);
                expect(error.error).withContext('message').toContain(errmess);
            }
        });

        const req = httpTestingController.expectOne(url);

        req.flush(errmess, { status: 500, statusText: 'Nieudana próba logowania' });
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });
});


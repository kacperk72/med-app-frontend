import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TokenInterceptorService } from './token-interceptor.service';

describe('TokenInterceptorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TokenInterceptorService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
    });

    it('should be created', inject([TokenInterceptorService], (service: TokenInterceptorService) => {
        expect(service).toBeTruthy();
    }));
});

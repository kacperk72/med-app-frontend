import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TermListService } from './term-list.service';

describe('TermListService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TermListService],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        });
    });

    it('should be created', inject([TermListService], (service: TermListService) => {
        expect(service).toBeTruthy();
    }));
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PacientRoleGuard } from './pacient-role.guard';

describe('PacientRoleGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PacientRoleGuard],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
        });
    });

    it('should ...', inject([PacientRoleGuard], (guard: PacientRoleGuard) => {
        expect(guard).toBeTruthy();
    }));
});


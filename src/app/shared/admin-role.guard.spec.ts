import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminRoleGuard } from './admin-role.guard';

describe('AdminRoleGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AdminRoleGuard],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
        });
    });

    it('should ...', inject([AdminRoleGuard], (guard: AdminRoleGuard) => {
        expect(guard).toBeTruthy();
    }));
});


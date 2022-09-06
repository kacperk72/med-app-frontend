import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DoctorRoleGuard } from './doctor-role.guard';

describe('DoctorRoleGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DoctorRoleGuard],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
        });
    });

    it('should ...', inject([DoctorRoleGuard], (guard: DoctorRoleGuard) => {
        expect(guard).toBeTruthy();
    }));
});


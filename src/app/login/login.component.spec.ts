import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;
    let http: HttpClient;
    let httpController: HttpTestingController;
    let loginSubscription: Subscription;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                FormBuilder,
                AuthService
            ]
        })
            .compileComponents();
        authService = TestBed.inject(AuthService);
        http = TestBed.inject(HttpClient);
        httpController = TestBed.inject(HttpTestingController);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        httpController.verify();
    });

    it('Login component should be created', () => {
        expect(component).toBeTruthy();
    });

    it('Auth service should be injected', () => {
        expect(authService).toBeDefined();
    });

});

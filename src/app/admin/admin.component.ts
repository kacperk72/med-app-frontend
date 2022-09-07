import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, Observable, Subscription } from 'rxjs';
import { EditDoctorElement, PeriodicElement } from '../models/doctor-types';
import { AdminService } from '../service/admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
    elementData$: Observable<PeriodicElement[]> = this.adminService.getDoctorsData().pipe(
        tap((elem) => {
            this.isLoaded = true;
        })
    );

    addDoctorForm!: FormGroup;
    displayedColumns: string[] = ['id_lekarza', 'name', 'surname', 'speciality', 'city', 'icons'];
    isVisibleAdd = true;
    isLoaded = false;

    doctorData = {};
    userId = '';
    role = 'lekarz';
    userName!: string;
    userSurname!: string;
    userLogin!: string;
    userPassword!: string;
    city!: string;
    speciality!: string;
    doctorDataJson: any;

    editPanel = false;

    private subaddDoctor$!: Subscription;
    private subdeleteDoctor$!: Subscription;

    constructor(private fb: FormBuilder, private router: Router, private adminService: AdminService) {}

    ngOnInit(): void {
        this.addDoctorForm = this.fb.group({
            name: [this.userName, Validators.required],
            surname: [this.userSurname, Validators.required],
            login: [this.userLogin, [Validators.required, Validators.minLength(3)]],
            password: [this.userPassword, [Validators.required, Validators.minLength(4)]],
            city: [this.city, Validators.required],
            speciality: [this.speciality, Validators.required],
        });
    }

    ngOnDestroy(): void {
        if (!!this.subdeleteDoctor$) {
            this.subdeleteDoctor$.unsubscribe();
        }
        if (!!this.subaddDoctor$) {
            this.subaddDoctor$.unsubscribe();
        }
    }

    addDoctor(): void {
        this.isVisibleAdd = !this.isVisibleAdd;
    }

    addDoctorDB(): void {
        if (this.isVisibleAdd === true) {
            this.isVisibleAdd = false;
        } else {
            this.isVisibleAdd = true;
        }
        this.userName = this.addDoctorForm.get('name')?.value;
        this.userSurname = this.addDoctorForm.get('surname')?.value;
        this.userLogin = this.addDoctorForm.get('login')?.value;
        this.userPassword = this.addDoctorForm.get('password')?.value;
        this.city = this.addDoctorForm.get('city')?.value;
        this.speciality = this.addDoctorForm.get('speciality')?.value;

        this.doctorData = {
            id: this.userId,
            name: this.userName,
            surname: this.userSurname,
            login: this.userLogin,
            password: this.userPassword,
            role: this.role,
            city: this.city,
            speciality: this.speciality,
        };

        this.subaddDoctor$ = this.adminService.addDoctor(this.doctorData).subscribe((response) => {
            console.log(response);
        });

        window.location.reload();
    }

    openEditPanel(element: EditDoctorElement): void {
        const idLek = element.user_id;
        const spec = element.speciality.join();
        const city = element.city;
        const login = element.login;
        const name = element.name;
        const surname = element.surname;

        this.router.navigate(['/adminEditDoctor', idLek, spec, city, login, name, surname]);
    }

    deleteDoctor(element: EditDoctorElement): void {
        const idLek = element.user_id;

        if (window.confirm('Napewno chcesz usunąć?')) {
            this.subdeleteDoctor$ = this.adminService.deleteDoctor(idLek).subscribe((resp) => {
                console.log('delete succesfulLy', resp);
            });
        }

        window.location.reload();
    }
}

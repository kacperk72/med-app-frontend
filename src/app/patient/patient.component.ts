import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map } from 'rxjs';
import { DoctorDataElement, ScheduleDataElement } from '../models/doctor-types';
import { PatientService } from '../service/patient.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { MatTableDataSource } from '@angular/material/table';
import { TermElement } from '../models/term-types';

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.css'],
})
export class PatientComponent implements OnInit {
    searchForm!: FormGroup;
    search = {
        role: '',
        city: '',
        dateFrom: '',
        dateTo: '',
        timeFrom: '',
    };
    // searchTimeTo: string = "";

    // zmienne na dane zwracane z bazy
    scheduleData: any;
    scheduleDataArray: ScheduleDataElement[] = [];
    termDataArray!: MatTableDataSource<TermElement>;
    termListArray: TermElement[] = [];

    //widocznosc elementow
    isVisibleForm = true;
    renderTable = false;
    // zmienne do załadowania danych do komponentów
    loadDataSpinner = false;
    isLoaded = true;

    //dane pobierane z bazy
    cities: any; //subscribe
    citiesArray: any[] = [];
    specialities: any; //subscribe
    specArray: string[] = [];
    uniqueSpecArray: string[] = [];
    spec = '';
    specAr: string[] = [];

    doctors: DoctorDataElement[] = [];
    doctorDataArray: DoctorDataElement[] = [];

    doctor = {
        userID: '',
        speciality: '',
        login: '',
        password: '',
        role: '',
        name: '',
        surname: '',
        city: '',
        term: '',
    };

    constructor(private fb: FormBuilder, private patientService: PatientService, private editDoctorService: EditDoctorService) {}

    ngOnInit(): void {
        this._getDoctors();

        this.patientService
            .getCities()
            .pipe(
                map((el) => {
                    el.map((elem) => {
                        this.citiesArray.push(elem.city);
                    });
                })
            )
            .subscribe();

        this.patientService
            .getSpec()
            .pipe(
                map((el) => {
                    el.map((elem) => {
                        this.spec = elem.speciality;
                        this.specAr = this.spec.split(', ');
                        this.specAr.forEach((element: string) => {
                            this.specArray.push(element);
                        });
                        this.uniqueSpecArray = [...new Set(this.specArray)];
                    });
                })
            )
            .subscribe();

        this.searchForm = this.fb.group({
            role: this.search.role,
            city: this.search.city,
            dateFrom: this.search.dateFrom,
            dateTo: this.search.dateTo,
            timeFrom: this.search.timeFrom,
        });
    }

    private _getDoctors(): void {
        this.patientService.getDoctors().subscribe((data) => {
            this.doctors = data;
        });
        // this.getSchedule();

        // console.log('DOCTORS_DATA_ARRAY', this.doctorDataArray);
        // console.log('SCHEDULE_DATA_ARRAY', this.scheduleDataArray);
        // console.log('TERM_LIST_ARRAY', this.termListArray);
    }

    getSchedule(): void {
        this.doctors.forEach((element) => {
            // console.log("doktor element", element);
            this.doctor.userID = element.id_lekarza;
            this.doctor.login = element.login;
            this.doctor.password = element.password;
            this.doctor.role = element.role;
            this.doctor.name = element.name;
            this.doctor.surname = element.surname;
            this.doctor.city = element.city;
            this._checkSpecAndGetSchedule(element);
        });
    }

    private _checkSpecAndGetSchedule(element: DoctorDataElement): void {
        if (element.speciality.includes(this.search.role) || this.search.role === '') {
            if (this.search.city.includes(element.city) || this.search.city === '') {
                this.doctorDataArray.push(element);
                this._getScheduleRequest();
            }
        }
    }

    private _getScheduleRequest(): void {
        this.editDoctorService.getFormSchedule(this.doctor.login, this.searchForm.value).subscribe((data) => {
            this.scheduleData = data;
            this.scheduleData.daneZGrafiku.forEach((element: ScheduleDataElement) => {
                element.name = this.scheduleData.name;
                element.surname = this.scheduleData.surname;
                element.speciality = this.scheduleData.spec;
                element.city = this.scheduleData.city;
                element.shortData = element.data.split('T')[0];
                element.visits = [];
                this.scheduleDataArray.push(element);
                // console.log(this.scheduleDataArray);
            });
        });
    }

    showList(): void {
        this.getSchedule();

        this.termListArray.sort((a, b) => {
            return Number(new Date(a.date)) - Number(new Date(b.date));
        });

        this.loadDataSpinner = true;
        this.renderTable = false;
        setTimeout(() => {
            this.loadDataSpinner = false;
            this.renderTable = true;
        }, 2000);
    }

    save(): void {
        this.search.role = this.searchForm.value.role;
        this.search.city = this.searchForm.value.city;
        this.search.dateFrom = this.searchForm.value.dateFrom;
        this.search.dateTo = this.searchForm.value.dateTo;
        this.search.timeFrom = this.searchForm.value.timeFrom;
    }
}

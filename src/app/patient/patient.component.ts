import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DoctorDataElement } from '../models/doctor-types';
import { PatientService } from '../service/patient.service';

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.css'],
})
export class PatientComponent implements OnInit, OnDestroy {
    searchForm!: FormGroup;
    searchData = [''];
    searchRole = '';
    searchCity = '';
    searchDateFrom = '';
    searchDateTo = '';
    searchTimeFrom = '';
    // searchTimeTo: string = "";

    //widocznosc elementow
    isVisibleForm = true;
    renderList = false;

    //dane pobierane z bazy
    cities: any; //subscribe
    citiesArray: any[] = [];
    specialities: any; //subscribe
    specArray: string[] = [];
    uniqueSpecArray: string[] = [];
    spec = '';
    specAr: string[] = [];

    doctors: DoctorDataElement[] = [];

    private subgetCities$!: Subscription;
    private subgetSpec$!: Subscription;

    constructor(private fb: FormBuilder, private patientService: PatientService) {}

    ngOnInit(): void {
        this.subgetCities$ = this.patientService.getCities().subscribe((resp) => {
            this.cities = resp;
            this.cities.forEach((el: { city: string }) => {
                this.citiesArray.push(el.city);
            });
        });

        // jeżeli specjalizacje zostaną podane w innej formnie niż "jenda, druga" to sie wysypie
        this.subgetSpec$ = this.patientService.getSpec().subscribe((resp) => {
            this.specialities = resp;
            this.specialities.forEach((el: { speciality: string }) => {
                this.spec = el.speciality;
                this.specAr = this.spec.split(', ');
                this.specAr.forEach((element: string) => {
                    // console.log(el);
                    this.specArray.push(element);
                });
                this.uniqueSpecArray = [...new Set(this.specArray)];
                // console.log(this.uniqueSpecArray);
            });
        });

        this.searchForm = this.fb.group({
            role: this.searchRole,
            city: this.searchCity,
            dateFrom: this.searchDateFrom,
            dateTo: this.searchDateTo,
            timeFrom: this.searchTimeFrom,
            // timeTo: this.searchTimeTo,
        });

        this._getDoctors();
    }

    ngOnDestroy(): void {
        if (this.subgetCities$) {
            this.subgetCities$.unsubscribe();
        }
        if (this.subgetSpec$) {
            this.subgetSpec$.unsubscribe();
        }
    }

    private _getDoctors(): void {
        this.patientService.getDoctors().subscribe((data) => {
            this.doctors = data;
        });
        // console.log('DOCTORS_DATA_ARRAY', this.doctorDataArray);
        // console.log('SCHEDULE_DATA_ARRAY', this.scheduleDataArray);
        // console.log('TERM_LIST_ARRAY', this.termListArray);
    }

    showList(): void {
        this.renderList = !this.renderList;
    }

    save(): void {
        this.searchRole = this.searchForm.get('role')?.value;
        this.searchCity = this.searchForm.get('city')?.value;
        this.searchDateFrom = this.searchForm.get('dateFrom')?.value;
        this.searchDateTo = this.searchForm.get('dateTo')?.value;
        this.searchTimeFrom = this.searchForm.get('timeFrom')?.value;
        // this.searchTimeTo = this.searchForm.get('timeTo')?.value;

        this.searchData = [this.searchRole, this.searchCity, this.searchDateFrom, this.searchDateTo, this.searchTimeFrom];
        // console.log(this.searchData);
    }
}

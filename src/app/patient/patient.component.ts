import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientService } from '../service/patient.service';

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.css']
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
    citiesArray: Object[] = [];
    specialities: any; //subscribe
    specArray: string[] = [];
    uniqueSpecArray: string[] = [];
    spec = '';
    specAr: string[] = [];

    private subgetCities$!: Subscription;
    private subgetSpec$!: Subscription;

    constructor(private fb: FormBuilder, private patientService: PatientService) { }

    ngOnInit(): void {
        this.subgetCities$ = this.patientService.getCities().subscribe(resp => {
            this.cities = resp;
            this.cities.forEach((el: { city: string }) => {
                this.citiesArray.push(el.city);
            });
        });

        // jeżeli specjalizacje zostaną podane w innej formnie niż "jenda, druga" to sie wysypie
        this.subgetSpec$ = this.patientService.getSpec().subscribe(resp => {
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
    }

    ngOnDestroy(): void{
        if(this.subgetCities$){
            this.subgetCities$.unsubscribe();
        }
        if(this.subgetSpec$){
            this.subgetSpec$.unsubscribe();
        }
    }

    showList(): void{
        this.renderList =!this.renderList;
    }

    save(): void{
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

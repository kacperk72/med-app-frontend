import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map, tap } from 'rxjs';
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
        visitTime: 15,
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
    loadDataSpinner2 = false;
    renderVisits = false;

    //dane pobierane z bazy
    cities: any; //subscribe
    citiesArray: any[] = [];
    specialities: any; //subscribe
    specArray: string[] = [];
    uniqueSpecArray: string[] = [];
    spec = '';
    specAr: string[] = [];
    visits: any = [];
    visit: any;

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
    paginator = 2;
    visitTime = 0;

    options = [
        { name: '15 min', value: 15 },
        { name: '30 min', value: 30 },
        { name: '1 h', value: 60 },
    ];
    speciality = 'specjalizacja';
    city = 'miasto';

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
            visitTime: this.search.visitTime,
            role: this.search.role,
            city: this.search.city,
            dateFrom: this.search.dateFrom,
            dateTo: this.search.dateTo,
            timeFrom: this.search.timeFrom,
        });
    }

    private _getDoctorsSchedule() {
        this.editDoctorService
            .getDoctorsSchedule(this.searchForm.value)
            .pipe(
                tap((data) => {
                    console.log(data);
                })
            )
            .subscribe();
    }

    private _getDoctors(): void {
        this.patientService.getDoctors().subscribe((data) => {
            this.doctors = data;
        });
    }

    private _getSchedule(): void {
        for (let i = 0; i < this.paginator; i++) {
            this.doctor.userID = this.doctors[i].id_lekarza;
            this.doctor.login = this.doctors[i].login;
            this.doctor.password = this.doctors[i].password;
            this.doctor.role = this.doctors[i].role;
            this.doctor.name = this.doctors[i].name;
            this.doctor.surname = this.doctors[i].surname;
            this.doctor.city = this.doctors[i].city;
            this._checkSpecAndGetSchedule(this.doctors[i]);
        }
    }

    sortArray() {
        this.scheduleDataArray.sort((a, b) => {
            return Number(new Date(a.data)) - Number(new Date(b.data));
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
            });
        });
    }

    calculateVisits(event: any): void {
        this.visitTime = event;
        this.scheduleDataArray.forEach((el) => {
            el.visits = [];
        });
        this.scheduleDataArray.forEach((elem) => {
            this.editDoctorService
                .getHourSchedule(elem.id_terminu, elem.id_lekarza, this.visitTime)
                .pipe(
                    map((el) => {
                        el.map((element: any) => {
                            this.visits.push(element);
                            this.scheduleDataArray.forEach((term) => {
                                if (term.id_lekarza === element.id_lekarza && term.id_terminu === element.id_terminu && term.data === element.data) {
                                    term.visits.push(element.godzina);
                                }
                            });
                        });
                    })
                )
                .subscribe(() => {});
        });
        this.sortArray();
        // this.loadDataSpinner = true;
        // // this.renderVisits = false;
        // // this.renderTable = false;
        // setTimeout(() => {
        //     this.loadDataSpinner = false;
        //     // this.renderTable = true;
        //     // this.renderVisits = true;
        // }, 1000);
    }

    loadMoreData(counter: number): void {
        this.paginator = counter;
        this.scheduleDataArray = [];
        this._getSchedule();
        // debugger;
        this.loadDataSpinner = true;
        this.renderTable = false;
        setTimeout(() => {
            this.loadDataSpinner = false;
            this.renderTable = true;
            this.calculateVisits(this.visitTime);
        }, 1000);
    }

    showList(): void {
        this._getDoctorsSchedule();

        this._getSchedule();
        this.loadDataSpinner = true;
        this.renderTable = false;
        this.renderVisits = false;
        setTimeout(() => {
            this.calculateVisits(this.searchForm.value.visitTime);
            this.loadDataSpinner = false;
            this.renderTable = true;
            this.renderVisits = true;
        }, 1000);
    }

    save(): void {
        this.search.role = this.searchForm.value.role;
        this.search.city = this.searchForm.value.city;
        this.search.dateFrom = this.searchForm.value.dateFrom;
        this.search.dateTo = this.searchForm.value.dateTo;
        this.search.timeFrom = this.searchForm.value.timeFrom;
    }
}

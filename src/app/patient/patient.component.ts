import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map } from 'rxjs';
import { PatientService } from '../service/patient.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { MatTableDataSource } from '@angular/material/table';

export interface DoctorSCH {
    name: string;
    surname: string;
    user_id: string;
    speciality: string;
    city: string;
    grafik: [];
    visits: [{ data: string; godzina: string; id_terminu: string }];
}

export interface DoctorTERM {
    id_terminu: string;
    name: string;
    surname: string;
    data: string;
    godzina: string;
    speciality: string;
    city: string;
}

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
        // dateTo: '',
        timeFrom: '',
    };

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

    options = [
        { name: '15 min', value: 15 },
        { name: '30 min', value: 30 },
        { name: '1 h', value: 60 },
    ];
    speciality = 'specjalizacja';
    city = 'miasto';

    doctorsScheduleWithVisits: DoctorSCH[] = [];
    termsArray: any = [];
    termDataArray!: MatTableDataSource<DoctorTERM>;

    paginator = 1;

    constructor(private fb: FormBuilder, private patientService: PatientService, private editDoctorService: EditDoctorService) {}

    ngOnInit(): void {
        // this._getDoctors();

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
            // dateTo: this.search.dateTo,
            timeFrom: this.search.timeFrom,
        });
    }

    private _getDoctorsSchedule(): void {
        this.termsArray = [];
        this.editDoctorService.getDoctorsSchedule(this.searchForm.value, this.paginator).subscribe((resp) => {
            this.doctorsScheduleWithVisits = resp;
            // console.log(this.doctorsScheduleWithVisits);
            this.doctorsScheduleWithVisits.forEach((doctor) => {
                doctor.grafik.forEach((termin: any) => {
                    doctor.visits.forEach((visit) => {
                        if (termin.id_terminu === visit.id_terminu) {
                            const id_terminu = termin.id_terminu;
                            const data = termin.data;
                            const godzina = visit.godzina;
                            const name = doctor.name;
                            const surname = doctor.surname;
                            const speciality = doctor.speciality;
                            const city = doctor.city;
                            this.termsArray.push({
                                id_terminu,
                                name,
                                surname,
                                data,
                                godzina,
                                speciality,
                                city,
                            });
                        }
                    });
                });
            });
            this.termsArray.sort((a: DoctorTERM, b: DoctorTERM) => {
                return Number(new Date(a.data)) - Number(new Date(b.data));
            });
            console.log(this.termsArray);

            this.termDataArray = new MatTableDataSource(this.termsArray);
        });
    }

    showList(): void {
        this._getDoctorsSchedule();

        this.loadDataSpinner = true;
        this.renderTable = false;
        this.renderVisits = false;
        setTimeout(() => {
            this.loadDataSpinner = false;
            this.renderTable = true;
            this.renderVisits = true;
        }, 1000);
    }

    save(): void {
        this.search.role = this.searchForm.value.role;
        this.search.city = this.searchForm.value.city;
        this.search.dateFrom = this.searchForm.value.dateFrom;
        // this.search.dateTo = this.searchForm.value.dateTo;
        this.search.timeFrom = this.searchForm.value.timeFrom;
    }

    loadMore(event: any): void {
        this.paginator = event;
        this.showList();
    }
}

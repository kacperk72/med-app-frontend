import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map } from 'rxjs';
import { PatientService } from '../service/patient.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { DoctorSCH, DoctorTERM } from '../models/doctor-types';

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
        timeFrom: '',
    };

    //widocznosc elementow
    isVisibleForm = true;
    renderTable = false;
    // zmienne do załadowania danych do komponentów
    loadDataSpinner = false;

    //dane pobierane z bazy
    citiesArray: string[] = [];
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

    termsArray: DoctorTERM[] = [];

    searching = false;
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
        this.loadDataSpinner = true;
        // this.termsArray = [];
        this.editDoctorService.getDoctorsSchedule(this.searchForm.value, this.paginator).subscribe((resp) => {
            // this.doctorsScheduleWithVisits = resp;
            // console.log(this.doctorsScheduleWithVisits);
            this.termsArray = this._mapper(resp).sort((a, b) => {
                return Number(new Date(a.data)) - Number(new Date(b.data));
            });
        });

        setTimeout(() => {
            this.loadDataSpinner = false;
        }, 1000);
    }

    private _mapper(data: DoctorSCH[]): DoctorTERM[] {
        const tmp: DoctorTERM[] = [];
        data.forEach((doctor) => {
            doctor.grafik.forEach((termin: any) => {
                doctor.visits.forEach((visit) => {
                    if (termin.id_terminu === visit.id_terminu) {
                        tmp.push({
                            id_terminu: termin.id_terminu,
                            data: termin.data,
                            godzina: visit.godzina,
                            name: doctor.name,
                            surname: doctor.surname,
                            speciality: doctor.speciality,
                            city: doctor.city,
                            reason: '',
                            login: '',
                        });
                    }
                });
            });
        });

        return tmp;
    }

    showList(): void {
        this.searching = true;
        this._getDoctorsSchedule();
    }

    save(): void {
        this.search.role = this.searchForm.value.role;
        this.search.city = this.searchForm.value.city;
        this.search.dateFrom = this.searchForm.value.dateFrom;
        // this.search.dateTo = this.searchForm.value.dateTo;
        this.search.timeFrom = this.searchForm.value.timeFrom;
    }

    loadMore(event: number): void {
        this.paginator = event;
        this.showList();
    }
}

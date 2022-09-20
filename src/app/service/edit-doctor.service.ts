import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor-types';
import { VisitFromDB } from '../models/term-types';
import { DoctorSCH } from '../patient/patient.component';

@Injectable({
    providedIn: 'root',
})
export class EditDoctorService {
    private _host: string;

    constructor(private httpClient: HttpClient) {
        this._host = 'http://localhost:3001';
    }

    getOneDoctor(doctorLogin: string): Observable<Doctor> {
        return this.httpClient.get<Doctor>(`${this._host}/doctor/getOne/${doctorLogin}`);
    }

    updateDoctorData(id: string, name: string, surname: string, speciality: string, city: string): Observable<void> {
        return this.httpClient.patch<void>(`${this._host}/doctor/update`, {
            id,
            name,
            surname,
            speciality,
            city,
        });
    }

    getSchedule(doctorLogin: string): Observable<Doctor> {
        return this.httpClient.get<Doctor>(`${this._host}/doctor/getSchedule/${doctorLogin}`);
    }

    // jednen REST zwracający przefiltrowane terminy z wizytami do zarezerwowania bez tych juz zajetych
    getDoctorsSchedule(value?: any, paginator?: number): Observable<DoctorSCH[]> {
        return this.httpClient.get<DoctorSCH[]>(`${this._host}/doctor/getDoctorsSchedule/${paginator}`, { params: value });
    }

    addTerm(id: string, date: string, timeFrom: string, timeTo: string): Observable<void> {
        return this.httpClient.post<void>(`${this._host}/doctor/addTerm`, {
            id,
            date,
            timeFrom,
            timeTo,
        });
    }

    getBookedTerms(id_lek: string): Observable<VisitFromDB[]> {
        return this.httpClient.get<VisitFromDB[]>(`${this._host}/doctor/getBookedTerms/${id_lek}`);
    }

    getHourFromTerm(term_id: number): Observable<{ godzina_wizyty: string }> {
        return this.httpClient.get<{ godzina_wizyty: string }>(`${this._host}/doctor/getHourFromTerm/${term_id}`);
    }

    getOnePacient(id_pacjenta: string): Observable<{ name: string; surname: string }> {
        return this.httpClient.get<{ name: string; surname: string }>(`${this._host}/doctor/getOnePacient/${id_pacjenta}`);
    }

    getDateFromTerm(id_terminu: string): Observable<{ data: string }> {
        return this.httpClient.get<{ data: string }>(`${this._host}/doctor/getDateFromTerm/${id_terminu}`);
    }

    cancelVisit(id_wizyty: string): Observable<void> {
        return this.httpClient.delete<void>(`${this._host}/doctor/cancelVisit/${id_wizyty}`);
    }

    updateDoctorTerm(id_terminu: string, timeF: number, timeT: number): Observable<void> {
        return this.httpClient.patch<void>(`${this._host}/doctor/updateTerm`, {
            id_terminu,
            timeF,
            timeT,
        });
    }

    deleteDoctorTerm(id_terminu: string): Observable<void> {
        return this.httpClient.delete<void>(`${this._host}/doctor/deleteTerm/${id_terminu}`);
    }
}

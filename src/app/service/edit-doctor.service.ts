import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, ScheduleDataElement, VisitElement } from '../models/doctor-types';
import { VisitFromDB } from '../models/term-types';

@Injectable({
    providedIn: 'root'
})
export class EditDoctorService {

    constructor(private httpClient: HttpClient) { }

    getOneDoctor(doctorLogin: string): Observable<Doctor>{
        return this.httpClient.get<Doctor>(`http://localhost:3001/doctor/getOne/${doctorLogin}`);
    }

    updateDoctorData(id: string, name: string, surname: string, speciality: string, city: string): Observable<void> {
        return this.httpClient.patch<void>('http://localhost:3001/doctor/update', {
            id,
            name,
            surname,
            speciality,
            city
        });
    }

    getSchedule(doctorLogin: string): Observable<Doctor>{
        return this.httpClient.get<Doctor>(`http://localhost:3001/doctor/getSchedule/${doctorLogin}`);
    }

    getHourList(id: string, element: ScheduleDataElement): Observable<VisitElement[]> {
        const fromHour = element.od_godziny;
        const toHour = element.do_godziny;
        const id_terminu = element.id_terminu;
        const data = element.data.split('T')[0];

        return this.httpClient.get<VisitElement[]>(`http://localhost:3001/doctor/getHourList/${fromHour}/${toHour}/${data}/${id}/${id_terminu}`);
    }

    addTerm(id: string, date: string, timeFrom: string, timeTo: string): Observable<void>{

        return this.httpClient.post<void>(`http://localhost:3001/doctor/addTerm`, {
            id,
            date,
            timeFrom,
            timeTo
        });
    }

    getBookedTerms(id_lek: string): Observable<VisitFromDB[]>{
        return this.httpClient.get<VisitFromDB[]>(`http://localhost:3001/doctor/getBookedTerms/${id_lek}`);
    }

    getHourFromTerm(term_id: number): Observable<{godzina_wizyty: string}>{
        return this.httpClient.get<{godzina_wizyty: string}>(`http://localhost:3001/doctor/getHourFromTerm/${term_id}`);
    }

    getOnePacient(id_pacjenta: string): Observable<{name: string; surname: string}>{
        return this.httpClient.get<{name: string; surname: string}>(`http://localhost:3001/doctor/getOnePacient/${id_pacjenta}`);
    }

    getDateFromTerm(id_terminu: string): Observable<{data: string}> {
        return this.httpClient.get<{data: string}>(`http://localhost:3001/doctor/getDateFromTerm/${id_terminu}`);
    }

    cancelVisit(id_wizyty: string): Observable<void>{
        return this.httpClient.delete<void>(`http://localhost:3001/doctor/cancelVisit/${id_wizyty}`);
    }

    updateDoctorTerm(id_terminu: string, timeF: number, timeT: number): Observable<void>{
        return this.httpClient.patch<void>(`http://localhost:3001/doctor/updateTerm`,{
            id_terminu,
            timeF,
            timeT
        });
    }

    deleteDoctorTerm(id_terminu: string): Observable<void> {
        return this.httpClient.delete<void>(`http://localhost:3001/doctor/deleteTerm/${id_terminu}`);
    }

}

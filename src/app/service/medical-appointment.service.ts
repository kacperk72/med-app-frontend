import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/pacient-types';
import { VisitFromDB } from '../models/term-types';

@Injectable({
    providedIn: 'root'
})
export class MedicalAppointmentService {

    constructor(private httpClient: HttpClient) { }

    getUser(login: string): Observable<User>{
        return this.httpClient.get<User>(`http://localhost:3001/pacient/getUser/${login}`);
    }

    getVisits(user_id: string): Observable<VisitFromDB[]> {
        return this.httpClient.get<VisitFromDB[]>(`http://localhost:3001/pacient/getVisits/${user_id}`);
    }

    getDetails(id_lekarza: string, id_terminu: string, term_id: number): Observable<VisitFromDB[]>{
        return this.httpClient.get<VisitFromDB[]>(`http://localhost:3001/pacient/getVisitData/${id_lekarza}/${id_terminu}/${term_id}`);
    }

    cancelVisit(term: any, user_id: string): Observable<void> {
        // console.log(term);
        const hour = term.godzina_wizyty;
        return this.httpClient.delete<void>(`http://localhost:3001/pacient/cancelVisit/${hour}/${user_id}`);
    }
}

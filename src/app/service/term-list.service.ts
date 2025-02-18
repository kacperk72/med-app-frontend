import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PacientBookTermElement } from '../models/pacient-types';
import { DoctorDataElement } from '../models/doctor-types';
import { TermElement, TermListVisitElement } from '../models/term-types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TermListService {

    constructor(private http: HttpClient) { }

    getTermInfo(): Observable<DoctorDataElement[]> {
        return this.http.get<DoctorDataElement[]>('http://localhost:3001/doctor');
    }

    bookTerm(data: PacientBookTermElement): Observable<TermElement> {
        return this.http.post<TermElement>('http://localhost:3001/visit', data);
    }

    checkVisit(element: TermListVisitElement): Observable<TermListVisitElement> {
        return this.http.get<TermListVisitElement>(`http://localhost:3001/visit/check/${element.data}/${element.term_id}/${element.id}`);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ScheduleDataTermElement } from '../models/doctor-types';
import { TermListVisitElement } from '../models/term-types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TermListService implements HttpClientModule {
    constructor(private http: HttpClient) {}

    bookTerm(data: ScheduleDataTermElement): Observable<ScheduleDataTermElement> {
        return this.http.post<ScheduleDataTermElement>('http://localhost:3001/visit', data);
    }

    checkVisit(element: TermListVisitElement): Observable<TermListVisitElement> {
        return this.http.get<TermListVisitElement>(`http://localhost:3001/visit/check/${element.data}/${element.term_id}/${element.id}`);
    }
}

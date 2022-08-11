import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PacientBookTermElement } from '../models/pacient-types';
import { DoctorDataElement } from '../models/doctor-types';
import { TermElement, TermListVisitElement } from '../models/term-types';

@Injectable({
  providedIn: 'root'
})
export class TermListService {

  constructor(private http: HttpClient) { }

  getTermInfo() {
    return this.http.get<Array<DoctorDataElement>>('http://localhost:3001/doctor')
  }

  bookTerm(data: PacientBookTermElement) {
    return this.http.post<TermElement>('http://localhost:3001/visit', data).subscribe(resp => {
      console.log(resp);
    }) 
  }

  checkVisit(element: TermListVisitElement) {
    return this.http.get<TermListVisitElement>(`http://localhost:3001/visit/check/${element.data}/${element.term_id}/${element.id}`)
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DoctorDataElement {
  id_lekarza: string;
  speciality: string;
  city: string;
  login: string;
  password: string;
  name: string;
  surname: string;
  role: string;
}

export interface TermElement {
  city: string;
  date: string;
  term_hour: string;
  id: string;
  login: string;
  name: string;
  surname: string;
  reason: string;
  speciality: string;
  term_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class TermListService {

  constructor(private http: HttpClient) { }

  getTermInfo() {
    return this.http.get<Array<DoctorDataElement>>('http://localhost:3001/doctor')
  }

  bookTerm(data: TermElement) {
    return this.http.post<TermElement>('http://localhost:3001/visit', data).subscribe(resp => {
      console.log(resp);
    }) 
  }
}
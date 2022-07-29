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

@Injectable({
  providedIn: 'root'
})
export class TermListService {

  constructor(private http: HttpClient) { }

  getTermInfo() {
    return this.http.get<Array<DoctorDataElement>>('http://localhost:3001/doctor')
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DoctorDataElement {
  id_lekarza: string;
  specjalnosc: string;
  miasto: string;
  login: string;
  haslo: string;
  imie: string;
  nazwisko: string;
  rola: string;
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

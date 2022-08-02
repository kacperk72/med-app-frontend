import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) { }

  getCities() {
    return this.http.get<Array<Object>>('http://localhost:3001/pacient/getCities')
  }

  getSpec() {
    return this.http.get<Array<Object>>('http://localhost:3001/pacient/getSpec')
  }

}

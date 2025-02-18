import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    constructor(private http: HttpClient) { }

    getCities(): Observable<{city: string}[]> {
        return this.http.get<{city: string}[]>('http://localhost:3001/pacient/getCities');
    }

    getSpec(): Observable<{speciality: string}[]> {
        return this.http.get<{speciality: string}[]>('http://localhost:3001/pacient/getSpec');
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DoctorDataElement } from '../models/doctor-types';


@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private http: HttpClient,) { }

    getDoctorsData(): Observable<any> {
        return this.http.get<any>('http://localhost:3001/doctor').pipe(
            map( (doctors: DoctorDataElement[]) => {
                return doctors.map(doc => ({ ...doc,
                    id_lekarza: doc.id_lekarza?.slice(0,7),
                    icons: ''}));
            }
            ));
    }

    addDoctor(doctorData: any): Observable<void>{
        return this.http.post<void>('http://localhost:3001/doctor/register', doctorData);
    }

    deleteDoctor(doctorId: string): Observable<void>{
        return this.http.delete<void>(`http://localhost:3001/doctor/delete/${doctorId}`);
    }
}

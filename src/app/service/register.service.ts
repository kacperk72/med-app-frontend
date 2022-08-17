import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterUser } from '../models/pacient-types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private http: HttpClient) { }

    registerUser(daneUsera: RegisterUser): Observable<void> {
        return this.http.post<void>('http://localhost:3001/user/register', daneUsera);
    }
}

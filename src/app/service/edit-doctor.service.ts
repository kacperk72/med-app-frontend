import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Doctor{
  name: string;
  surname: string;
  speciality: string;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditDoctorService {

  constructor(private httpClient: HttpClient) { }

  getOneDoctor(doctorLogin: string) {
    return this.httpClient.get<Doctor>(`http://localhost:3001/doctor/getOne/${doctorLogin}`)
  }

  getSchedule(doctorLogin: string){
    return this.httpClient.get<Doctor>(`http://localhost:3001/doctor/getSchedule/${doctorLogin}`)
    
  }
}

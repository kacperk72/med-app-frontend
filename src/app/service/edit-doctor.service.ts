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

  updateDoctorData(id: string, name: string, surname: string, speciality: string, city: string) {

    this.httpClient.patch('http://localhost:3001/doctor/update', {
      id,
      name,
      surname,
      speciality,
      city
    }).subscribe(res => {
      console.log("dane zapisane poprawnie");
    });
  }

  getSchedule(doctorLogin: string){
    return this.httpClient.get<Doctor>(`http://localhost:3001/doctor/getSchedule/${doctorLogin}`)
    
  }

  getHourList(id: string, termData: string, fromHour: string, toHour: string) {
    const data = termData.split('T')[0];

    return this.httpClient.get(`http://localhost:3001/doctor/getHourList/${fromHour}/${toHour}/${data}/${id}`)
  }

  addTerm(id: string, date: string, timeFrom: string, timeTo: string){
    
    return this.httpClient.post(`http://localhost:3001/doctor/addTerm`, {
      id,
      date,
      timeFrom,
      timeTo
    });
  }
}

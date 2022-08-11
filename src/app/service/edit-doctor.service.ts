import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor-types';

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

  getHourList(id: string, termData: string, fromHour: string, toHour: string, id_terminu: string) {
    const data = termData.split('T')[0];

    return this.httpClient.get(`http://localhost:3001/doctor/getHourList/${fromHour}/${toHour}/${data}/${id}/${id_terminu}`)
  }

  addTerm(id: string, date: string, timeFrom: string, timeTo: string){
    
    return this.httpClient.post(`http://localhost:3001/doctor/addTerm`, {
      id,
      date,
      timeFrom,
      timeTo
    });
  }

  getBookedTerms(id_lek: string){
    // console.log(id_lek);
    return this.httpClient.get(`http://localhost:3001/doctor/getBookedTerms/${id_lek}`)
  }

  getHourFromTerm(term_id: number): Observable<{godzina_wizyty: string}>{
    return this.httpClient.get<{godzina_wizyty: string}>(`http://localhost:3001/doctor/getHourFromTerm/${term_id}`)
  }

  getOnePacient(id_pacjenta: string): Observable<{name: string, surname: string}>{
    return this.httpClient.get<{name: string, surname: string}>(`http://localhost:3001/doctor/getOnePacient/${id_pacjenta}`)
  }

  getDateFromTerm(id_terminu: string): Observable<{data: string}> {
    return this.httpClient.get<{data: string}>(`http://localhost:3001/doctor/getDateFromTerm/${id_terminu}`)
  }

  cancelVisit(id_wizyty: string){
    return this.httpClient.delete(`http://localhost:3001/doctor/cancelVisit/${id_wizyty}`)
  }

  updateDoctorTerm(id_terminu: string, timeF: number, timeT: number){
    return this.httpClient.patch(`http://localhost:3001/doctor/updateTerm`,{
      id_terminu,
      timeF,
      timeT
    }).subscribe(res => {
      console.log("dane zapisane poprawnie");
    });
  }

  deleteDoctorTerm(id_terminu: string) {
    return this.httpClient.delete(`http://localhost:3001/doctor/deleteTerm/${id_terminu}`)
  }

}

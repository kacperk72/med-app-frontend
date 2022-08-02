import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface User{
  user_id: string;
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalAppointmentService {

  constructor(private httpClient: HttpClient) { }

  getUser(login: string) {
    return this.httpClient.get<User>(`http://localhost:3001/pacient/getUser/${login}`)
  }

  getVisits(user_id: string) {
    return this.httpClient.get(`http://localhost:3001/pacient/getVisits/${user_id}`)
  }

  getDetails(id_lekarza: string, id_terminu: string, term_id: number){
    // console.log("id_lekarza", id_lekarza);
    // console.log("id_terminu", id_terminu);
    // console.log("term_id", term_id);

    return this.httpClient.get(`http://localhost:3001/pacient/getVisitData/${id_lekarza}/${id_terminu}/${term_id}`);
  }
}

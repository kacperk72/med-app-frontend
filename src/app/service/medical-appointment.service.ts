import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/pacient-types';

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
    return this.httpClient.get(`http://localhost:3001/pacient/getVisitData/${id_lekarza}/${id_terminu}/${term_id}`);
  }

  cancelVisit(term: any, user_id: string) {
    console.log(term);
    const hour = term.godzina_wizyty;
    return this.httpClient.delete(`http://localhost:3001/pacient/cancelVisit/${hour}/${user_id}`).subscribe(resp => {
      console.log("delete succesfull", resp);
    })
  }
}

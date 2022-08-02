import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MedicalAppointmentService } from '../service/medical-appointment.service';

export interface TermDataElement {
  name: string;
  surname: string;
  speciality: string;
  data: string;
  hour: string;
}

const TERMS_DATA_AFTER: TermDataElement[] = [];
const TERMS_DATA_BEFORE: TermDataElement[] = [];

@Component({
  selector: 'app-medical-appointment',
  templateUrl: './medical-appointment.component.html',
  styleUrls: ['./medical-appointment.component.css']
})
export class MedicalAppointmentComponent implements OnInit {
  //pobrane z tokenu
  token: string = '';
  tokenJSON: any;
  login: string = '';

  //pobrane z bazy
  user_id: string = '';
  name: string = '';
  surname: string = '';
  data: any;
  visitData: any;
  termDataArrayAfter: any;
  termDataArrayBefore: any;

  constructor(private authService: AuthService, private medicalAppointment: MedicalAppointmentService) { }

  ngOnInit(): void {
    this.token = this.authService.GetToken();
    this.tokenJSON = this.authService.GetRolebyToken(this.token);
    this.login = this.tokenJSON.login;
    
    //potrzebuje imie, nazwisko, id żeby pobrac sobie wizyty 
    this.medicalAppointment.getUser(this.login).subscribe(resp => {
      // console.log(resp);
      const user = resp;
      this.user_id = resp.user_id;
      this.name = resp.name;
      this.surname = resp.surname;

      //pobranie wizyt użytkownika
      this.medicalAppointment.getVisits(this.user_id).subscribe(resp => {
        // console.log(resp);
        this.data = resp;
        this.data.forEach((el: any) => {
          // console.log(el);
          TERMS_DATA_AFTER.splice(0,TERMS_DATA_AFTER.length);
          TERMS_DATA_BEFORE.splice(0,TERMS_DATA_BEFORE.length);
          this.medicalAppointment.getDetails(el.id_lekarza, el.id_terminu, el.term_id).subscribe(resp => {
            this.visitData = resp;
            this.visitData.data = this.visitData.data.split('T')[0];
            const date1 = new Date(this.visitData.data);
            const today = new Date();
            
            if(date1 > today) {
              TERMS_DATA_AFTER.push(this.visitData)
            } 
            if(date1 < today) {
              TERMS_DATA_BEFORE.push(this.visitData);
            }
          })
          this.termDataArrayAfter = TERMS_DATA_AFTER;
          this.termDataArrayBefore = TERMS_DATA_BEFORE;
        })
      })
    })
  }
}

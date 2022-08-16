import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PacientTermElement } from '../models/pacient-types';
import { BookedTermElement, BookedTermElementFull, TermDataElement } from '../models/term-types';
import { tokenElement } from '../models/token-types';
import { AuthService } from '../service/auth.service';
import { MedicalAppointmentService } from '../service/medical-appointment.service';

@Component({
  selector: 'app-medical-appointment',
  templateUrl: './medical-appointment.component.html',
  styleUrls: ['./medical-appointment.component.css']
})
export class MedicalAppointmentComponent implements OnInit {
  
  //pobrane z tokenu
  token: string = '';
  tokenJSON!: tokenElement;
  login: string = '';

  //pobrane z bazy
  user_id: string = '';
  name: string = '';
  surname: string = '';
  data: any; //subscribe
  visitData: any; //subscribe
  termDataArrayAfter: PacientTermElement[] = [];
  termDataArrayBefore: PacientTermElement[] = [];

  private subgetUser$!: Subscription;
  private subgetVisits$!: Subscription;
  private subgetDetails$!: Subscription;

  constructor(private authService: AuthService, private medicalAppointment: MedicalAppointmentService) { }

  ngOnInit(): void {
    this.token = this.authService.GetToken();
    this.tokenJSON = this.authService.GetRolebyToken(this.token);
    this.login = this.tokenJSON.login;
    
    //potrzebuje imie, nazwisko, id żeby pobrac sobie wizyty 
    this.subgetUser$ = this.medicalAppointment.getUser(this.login).subscribe(resp => {
      // console.log(resp);
      const user = resp;
      this.user_id = resp.user_id;
      this.name = resp.name;
      this.surname = resp.surname;

      //pobranie wizyt użytkownika
      this.subgetVisits$ = this.medicalAppointment.getVisits(this.user_id).subscribe(resp => {
        // console.log(resp);
        this.data = resp;
        this.data.forEach((el: BookedTermElementFull) => {
          // console.log(el);
          this.subgetDetails$ = this.medicalAppointment.getDetails(el.id_lekarza, el.id_terminu, el.term_id).subscribe(resp => {
            this.visitData = resp;
            this.visitData.data = this.visitData.data.split('T')[0];
            const date1 = new Date(this.visitData.data);
            const today = new Date();
            
            if(date1 > today) {
              this.termDataArrayAfter.push(this.visitData)
            } 
            if(date1 < today) {
              this.termDataArrayBefore.push(this.visitData);
            }
          })
          this.termDataArrayAfter = this.termDataArrayAfter;
          this.termDataArrayBefore = this.termDataArrayBefore;
        })
      })
    })
  }
  
  ngOnDestroy(){
    if(this.subgetUser$){
      this.subgetUser$.unsubscribe();
    }
    if(this.subgetDetails$){
      this.subgetDetails$.unsubscribe();
    }
    if(this.subgetVisits$){
      this.subgetVisits$.unsubscribe();
    }
  }

  cancelVisit(term: PacientTermElement) {
    // console.log(term);
    this.medicalAppointment.cancelVisit(term, this.user_id);
    window.location.reload();
  }
}

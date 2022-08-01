import { Component, OnInit } from '@angular/core';
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
  tokenJSON: any;
  login: string = '';

  //pobrane z bazy
  user_id: string = '';
  name: string = '';
  surname: string = '';
  data: any;



  constructor(private authService: AuthService, private medicalAppointment: MedicalAppointmentService) { }

  ngOnInit(): void {
    this.token = this.authService.GetToken();
    this.tokenJSON = this.authService.GetRolebyToken(this.token);
    this.login = this.tokenJSON.login;

    //potrzebuje imie, nazwisko, id żeby pobrac sobie wizyty 
    this.medicalAppointment.getUser(this.login).subscribe(resp => {
      console.log(resp);
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

          //pobierz dane i wrzuc do tablicy

          // const id_lekarza = resp.id_lekarza;
          // po id_lekarza trzeba wybiagnąć imie i nazwisko lekarza
          // oraz innym zapytaniem specjalizacje 
          // po id_terminu trzeba wyciagac date
          // po term_id trzeba wyciagnac godzine
          this.medicalAppointment.getDetails(el.id_lekarza, el.id_terminu, el.term_id).subscribe(resp => {
            console.log(resp);
          
        })
        
          
        })
        
      })
      
    })
  }
}

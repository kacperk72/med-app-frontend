import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { EditDoctorService } from '../service/edit-doctor.service';

export interface ScheduleDataElement{
  id_lekarza: string;
  id_terminu: string;
  data: string;
  od_godziny: string;
  do_godziny: string;
}

const SCHEDULE_DATA: ScheduleDataElement[] = [];

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css'],
})
export class EditDoctorComponent implements OnInit {

  //widocznosc w celu pobrania danych i poprawnego wygrnerowania
  isVisibleEdit = true;
  isLoaded: boolean = false;
  isLoadedSchedule: boolean = false;
  // zmienne na dane zwracane z bazy
  doctorData: any;
  scheduleData: any;
  token: string = '';
  tokenJson: any;

  //zmienne do przetwarzania wyświetlanych danych
  doctorLogin: string = '';
  doctorPassword: string = '';
  nameInputValue = '';
  surnameInputValue = '';
  specialityInputValue = '';
  cityInputValue = '';
  date:any;
  from_hour:any;
  to_hour:any;
  scheduleDataArray: any;
  

  constructor(private authService: AuthService, private httpClient: HttpClient, private editDoctorService: EditDoctorService) { }

  ngOnInit(): void {
    this.token = this.authService.GetToken();
    this.tokenJson = this.authService.GetRolebyToken(this.token);
    this.doctorLogin = this.tokenJson.login;
    this.doctorPassword = this.tokenJson.password;

    this.editDoctorService.getOneDoctor(this.doctorLogin).subscribe((data) => {
      this.doctorData = data;
      console.log(this.doctorData);
      if(this.doctorData != []){
        this.nameInputValue = this.doctorData.name;
        this.surnameInputValue = this.doctorData.surname;
        this.specialityInputValue = this.doctorData.speciality;
        this.cityInputValue = this.doctorData.city;

        this.isLoaded = true;
      } else {
        console.log("wystąpił błąd pobierania danych z bazy");
      }
    });

    this.editDoctorService.getSchedule(this.doctorLogin).subscribe((data) => {
      this.scheduleData = data;
      this.scheduleData.forEach((element: ScheduleDataElement) => {
        SCHEDULE_DATA.push(element)
        this.scheduleDataArray = SCHEDULE_DATA;
      });
      this.isLoadedSchedule = true;
      console.log("schedule data", this.scheduleDataArray);
      
    })

  }

  editTerm() {
    if(this.isVisibleEdit == true){
      this.isVisibleEdit = false;
    } else {
      this.isVisibleEdit = true;
    }
  }

}

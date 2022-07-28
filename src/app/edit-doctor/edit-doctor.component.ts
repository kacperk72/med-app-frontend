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

export interface TermListElement{
  data:string;
  od_godziny: string;
}

const SCHEDULE_DATA: ScheduleDataElement[] = [];

const TERM_LIST: TermListElement[] = [];

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
  token: string = '';
  tokenJson: any;
  scheduleData: any;
  scheduleDataArray: any;
  termData: any;
  termDataArray: any;
  

  //zmienne do przetwarzania wyświetlanych danych
  doctorLogin: string = '';
  doctorPassword: string = '';
  nameInputValue = '';
  surnameInputValue = '';
  specialityInputValue = '';
  cityInputValue = '';
  doctorID = '';
  date:any;
  from_hour:any;
  to_hour:any;
 

  constructor(private authService: AuthService, private httpClient: HttpClient, private editDoctorService: EditDoctorService) { }

  ngOnInit(): void {
    // pobranie danych doktora z tokenu
    this.token = this.authService.GetToken();
    this.tokenJson = this.authService.GetRolebyToken(this.token);
    this.doctorLogin = this.tokenJson.login;
    this.doctorPassword = this.tokenJson.password;

    // pobranie danych doktora z bazy
    this.editDoctorService.getOneDoctor(this.doctorLogin).subscribe((data) => {
      this.doctorData = data;
      // console.log(this.doctorData);
      if(this.doctorData != []){
        this.doctorID = this.doctorData.id_lekarza;
        this.nameInputValue = this.doctorData.name;
        this.surnameInputValue = this.doctorData.surname;
        this.specialityInputValue = this.doctorData.speciality;
        this.cityInputValue = this.doctorData.city;

        this.isLoaded = true;
      } else {
        console.log("wystąpił błąd pobierania danych z bazy");
      }
    });

    // pobranie grafiku i listy terminów
    this.editDoctorService.getSchedule(this.doctorLogin).subscribe((data) => {
      this.scheduleData = data;
      //iterowanie po dniach zapisanych w grafiku lekarza
      this.scheduleData.forEach((element: ScheduleDataElement) => {
        SCHEDULE_DATA.push(element)
        // console.log("element", element);
        this.editDoctorService.getHourList(this.doctorID, element.data, element.od_godziny, element.do_godziny).subscribe((response) => {
          // console.log("response", response);
          this.termData = response;
          // iterowanie po godzinach wyznaczonych jako termin na wizytę
          this.termData.forEach((element: TermListElement) => {
            TERM_LIST.push(element);
          })
          this.termDataArray = TERM_LIST;
        });;
      });
      this.scheduleDataArray = SCHEDULE_DATA;
      this.isLoadedSchedule = true;
    });
  }

  updateDoctor(name: string, surname: string, speciality: string, city: string): void{
    this.editDoctorService.updateDoctorData(this.doctorID, name, surname, speciality, city);
  }

  editTerm() {
    if(this.isVisibleEdit == true){
      this.isVisibleEdit = false;
    } else {
      this.isVisibleEdit = true;
    }
  }

}

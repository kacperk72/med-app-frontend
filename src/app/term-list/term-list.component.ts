import { Component, OnInit } from '@angular/core';
import { EditDoctorService } from '../service/edit-doctor.service';
import { DoctorDataElement, TermListService } from '../service/term-list.service';

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

const DOCTORS_DATA: DoctorDataElement[] = [];
const SCHEDULE_DATA: ScheduleDataElement[] = [];
const TERM_LIST: TermListElement[] = [];


@Component({
  selector: 'app-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.css']
})
export class TermListComponent implements OnInit {
  userID = '';
  speciality = '';
  login = '';
  password = '';
  role = '';
  name = '';
  surname = '';
  city = '';
  term = '';

  // zmienne na dane zwracane z bazy
  scheduleData: any;
  scheduleDataArray: any;
  termData: any;
  termDataArray: any;

  // zmienne do załadowania danych do komponentów
  isVisible = true;
  isLoaded = false;
  isLoadedSchedule: boolean = false;

  //kolumny w tabeli terminów
  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
  doctorsDataSource = DOCTORS_DATA;

  constructor(private termListService: TermListService, private editDoctorService: EditDoctorService) { }

  ngOnInit(): void {
    this.getDoctorsData();
  }

  getDoctorsData() {
      DOCTORS_DATA.splice(0, DOCTORS_DATA.length);
      this.termListService.getTermInfo().subscribe((data) => {
        data.forEach (element => {
          this.userID = element.id_lekarza;
          this.speciality = element.specjalnosc;
          this.login = element.login;
          this.password = element.haslo;
          this.role = element.rola;
          this.name = element.imie;
          this.surname = element.nazwisko;
          this.city = element.miasto;   
          
          // pobranie grafiku i listy terminów
          this.editDoctorService.getSchedule(this.login).subscribe((data) => {
            this.scheduleData = data;
            //iterowanie po dniach zapisanych w grafiku lekarza
            this.scheduleData.forEach((element: ScheduleDataElement) => {
              SCHEDULE_DATA.push(element)
              // console.log("element", element);
              this.editDoctorService.getHourList(this.userID, element.data, element.od_godziny, element.do_godziny).subscribe((response) => {
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
        this.isLoaded = true;

        console.log("DOCTORS_DATA", DOCTORS_DATA);
        console.log("SCHEDULE_DATA", SCHEDULE_DATA);
        console.log("TERM_LIST", TERM_LIST);
        
        DOCTORS_DATA.push(element);
        });
      })
  }


  
  confirmTerm() { 
    if(this.isVisible == true){
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

}

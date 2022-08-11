import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DoctorDataElement, ScheduleDataElement } from '../models/doctor-types';
import { PacientBookTermElement } from '../models/pacient-types';
import { TermElement } from '../models/term-types';
import { PatientComponent } from '../patient/patient.component';
import { AuthService } from '../service/auth.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { TermListService } from '../service/term-list.service';

const DOCTORS_DATA: DoctorDataElement[] = [];
const SCHEDULE_DATA: ScheduleDataElement[] = [];
const TERM_LIST: TermElement[] = [];

@Component({
  selector: 'app-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.css']
})
export class TermListComponent implements OnInit {
  subscription1$!: Subscription;
  subscription2$!: Subscription;
  subscription3$!: Subscription;

  @Input()
  searchForm!: FormGroup;  

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

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
  scheduleDataArray!: Array<ScheduleDataElement>;
  termData: any;
  termDataArray!: MatTableDataSource<TermElement>;
  // zmienne do załadowania danych do komponentów
  isVisible = true;
  isLoaded = true;
  allDataLoaded = false;

  //kolumny w tabeli terminów
  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
  doctorsDataSource = TERM_LIST;

  //zmienne do rezerwacji wizyty
  termDataBooking!: PacientBookTermElement;

  //zmienne z fomularza do filtrowania wyników
  searchRole: string = "";
  searchCity: string = "";
  searchDateFrom: string = "";
  searchDateTo: string = "";
  searchTimeFrom: string = "";
  searchData = [''];

  // dla zarezerwowanych wizyt
  isVisitFree: boolean = true;

  constructor(private termListService: TermListService, private editDoctorService: EditDoctorService, private authService: AuthService) { }

  ngOnInit() {
    this.searchRole = this.searchForm.get('role')?.value;
    this.searchCity = this.searchForm.get('city')?.value;
    this.searchDateFrom = this.searchForm.get('dateFrom')?.value
    this.searchDateTo = this.searchForm.get('dateTo')?.value;
    this.searchTimeFrom = this.searchForm.get('timeFrom')?.value;
    this.searchData = [this.searchRole, this.searchCity, this.searchDateFrom, this.searchDateTo, this.searchTimeFrom];
    // console.log("searchData w child", this.searchData);

    this.getDoctors();

  }

  // ngOnDestroy(){
  //   this.subscription1$.unsubscribe();
  //   this.subscription2$.unsubscribe();
  //   this.subscription3$.unsubscribe();
  // }

  getDoctors() {
    SCHEDULE_DATA.splice(0, SCHEDULE_DATA.length);
    TERM_LIST.splice(0, TERM_LIST.length);

    this.subscription1$ = this.termListService.getTermInfo().subscribe((data) => {
      data.forEach(element => {
        // console.log("doktor element", element);
        this.userID = element.id_lekarza;
        this.speciality = element.speciality;
        this.login = element.login;
        this.password = element.password;
        this.role = element.role;
        this.name = element.name;
        this.surname = element.surname;
        this.city = element.city; 

        // sprawdzam czy w formularzu była jego specjalizacja
        if(element.speciality.includes(this.searchRole) || this.searchRole === ''){
          if(this.searchCity.includes(element.city) || this.searchCity === '') {
            DOCTORS_DATA.push(element);
            this.getSchedule();
          }
        }
      });
    })
    console.log("DOCTORS_DATA", DOCTORS_DATA);
    console.log("SCHEDULE_DATA", SCHEDULE_DATA);
    console.log("TERM_LIST", TERM_LIST);
}

// pobranie grafiku i listy terminów
  getSchedule() {
  this.subscription2$ = this.editDoctorService.getSchedule(this.login).subscribe((data) => {
    this.scheduleData = data;
    //iterowanie po dniach zapisanych w grafiku lekarza
    this.scheduleData.forEach((element: ScheduleDataElement) => {
      // sprawdzam czy data zawiera sie w podanych widełkach formularza
      if(new Date(element.data.split('T')[0]) >= new Date(this.searchDateFrom) && new Date(element.data.split('T')[0]) <= new Date(this.searchDateTo) || (this.searchDateFrom === "" && this.searchDateTo === "")){
        SCHEDULE_DATA.push(element)
        this.scheduleDataArray = SCHEDULE_DATA;
        this.subscription3$ = this.editDoctorService.getHourList(element.id_lekarza, element.data, element.od_godziny, element.do_godziny, element.id_terminu).subscribe((response) => {
          this.termData = response;
          
          // iterowanie po godzinach wyznaczonych jako termin na wizytę
          this.termData.forEach((element: TermElement) => {
            // sprawdzam czy godzina wizyty zawiera sie w widełkach formularza
            if(element.godzina_wizyty >= (this.searchTimeFrom + ':00') || this.searchTimeFrom === '') {
              for(let i=0; i<DOCTORS_DATA.length;i++){
                  if(DOCTORS_DATA[i].id_lekarza == element.id){
                    element.name = DOCTORS_DATA[i].name;
                    element.surname = DOCTORS_DATA[i].surname;
                    element.city = DOCTORS_DATA[i].city;
                    element.speciality = DOCTORS_DATA[i].speciality;
                  }
                }
                TERM_LIST.push(element);
            }
          })
          this.setPaginator();
        });
      }
    });
  }); 
}

setPaginator(){
  TERM_LIST.sort(function(a,b){
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });

  this.termDataArray = new MatTableDataSource(TERM_LIST);
  this.termDataArray.paginator = this.paginator;
  this.isLoaded = true;
}
  
confirmTerm(element: PacientBookTermElement) { 
  if(this.isVisible == true){
    this.isVisible = false;
  } else {
    this.isVisible = true;
  }
  this.termDataBooking = element;
  console.log(this.termDataBooking);

}

closeBooking() {
  this.isVisible = true;
}

// rezerwacja wizyty
bookTerm() {
  let textAreaValue;
  const token = this.authService.GetToken();
  const tokenJson = this.authService.GetRolebyToken(token);
  const login = tokenJson.login;

  if(document.querySelector('#textArea')){
    textAreaValue = document.querySelector<HTMLInputElement>('#textArea')?.value;
  }

  this.termDataBooking.reason = textAreaValue || "";
  this.termDataBooking.login = login;
  // console.log(this.termDataBooking);

  // dodawanie wpisu
  this.termListService.bookTerm(this.termDataBooking);
  this.closeBooking();
  window.location.reload();
  window.alert("Rezerwacja zakończona sukcesem!")
}
}

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatientComponent } from '../patient/patient.component';
import { AuthService } from '../service/auth.service';
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
  speciality: string;
  city: string;
  id: string;
  data:string;
  godzina_wizyty: string;
  name: string;
  surname: string;
  isVisitFree: boolean;
  term_id: number;
  wynik: string;
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

  @Input()
  searchForm!: FormGroup;  

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
  allDataLoaded = false;

  //kolumny w tabeli terminów
  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
  doctorsDataSource = TERM_LIST;

  iterator = 0;
  sumeOfVisits = 0;

  //zmienne do rezerwacji wizyty
  termDataBooking: any;

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
    this.getDoctorsData();
    // this.loadTerm();
    this.searchRole = this.searchForm.get('role')?.value;
    this.searchCity = this.searchForm.get('city')?.value;
    this.searchDateFrom = this.searchForm.get('dateFrom')?.value
    this.searchDateTo = this.searchForm.get('dateTo')?.value;
    this.searchTimeFrom = this.searchForm.get('timeFrom')?.value;
    this.searchData = [this.searchRole, this.searchCity, this.searchDateFrom, this.searchDateTo, this.searchTimeFrom];
    // console.log("searchData w child", this.searchData);
  }

  getDoctorsData() {
    TERM_LIST.splice(0, TERM_LIST.length);
    SCHEDULE_DATA.splice(0, DOCTORS_DATA.length);
    TERM_LIST.splice(0, SCHEDULE_DATA.length);

    this.termListService.getTermInfo().subscribe((data) => {
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
            // pobranie grafiku i listy terminów
            this.editDoctorService.getSchedule(this.login).subscribe((data) => {
              this.scheduleData = data;
              // console.log("data",data);
              //iterowanie po dniach zapisanych w grafiku lekarza
              this.scheduleData.forEach((element: ScheduleDataElement) => {
                // console.log("element", element);
  
                // sprawdzam czy data zawiera sie
                if(new Date(element.data.split('T')[0]) >= new Date(this.searchDateFrom) && new Date(element.data.split('T')[0]) <= new Date(this.searchDateTo) || (this.searchDateFrom === "" && this.searchDateTo === "")){
                  SCHEDULE_DATA.push(element)
                  this.scheduleDataArray = SCHEDULE_DATA;
    
                  // obliczanie ilosci wizyt aby stworzyc licznik do generowania
                  // byćmoże po zarezerwowaniu wizyty sie wysypie bo będzie ich mniej generowało albo zrobić tak że wizyta będzie na szaro czy coś, jeżeli w grafiku podana jest dostepnosc np. od 9.15 do 9.45 to nie wydzieli wizyt -- do poprawki
                  let toHour = element.do_godziny.split(':');
                  let fromHour = element.od_godziny.split(':');
                  let resultInHours = parseInt(toHour[0]) - parseInt(fromHour[0]);
                  this.sumeOfVisits += resultInHours * 4;
                  // console.log(this.sumeOfVisits);
    
                  this.editDoctorService.getHourList(element.id_lekarza, element.data, element.od_godziny, element.do_godziny).subscribe((response) => {
                    this.termData = response;
                    // console.log("termData", this.termData);
                    
                    // iterowanie po godzinach wyznaczonych jako termin na wizytę
                    this.termData.forEach((element: TermListElement) => {
                      // console.log("termin element", element);
                      this.iterator++;
                      if(element.godzina_wizyty >= (this.searchTimeFrom + ':00') || this.searchTimeFrom === '') {
                        for(let i=0; i<DOCTORS_DATA.length;i++){
                            if(DOCTORS_DATA[i].id_lekarza == element.id){
                              element.name = DOCTORS_DATA[i].name;
                              element.surname = DOCTORS_DATA[i].surname;
                              element.city = DOCTORS_DATA[i].city;
                              element.speciality = DOCTORS_DATA[i].speciality;

                              this.termListService.checkVisit(element).subscribe(resp => {
                                let result:boolean = resp.wynik.toLowerCase();
                                this.isVisitFree = result;
                                // console.log(result);
                              })
                            }
                          }
                        element.isVisitFree = this.isVisitFree;
                        // console.log("isVisitFree", element.isVisitFree);
                        // console.log("pushuje");
                        TERM_LIST.push(element);
                        // console.log("iterator", this.iterator);

                        if(this.iterator == this.sumeOfVisits){
                          // console.log("sortowanie");
                          TERM_LIST.sort(function(a,b){
                            return Number(new Date(a.data)) - Number(new Date(b.data));
                          });

                          this.termDataArray = TERM_LIST;

                          // console.log("ładowanie");
                          this.isLoaded = true;
                        }
                      }
                    })
                  });
                }
              });
            }); 
          }
        }
      });
    })
    console.log("DOCTORS_DATA", DOCTORS_DATA);
    console.log("SCHEDULE_DATA", SCHEDULE_DATA);
    console.log("TERM_LIST", TERM_LIST);
}

loadTerm() {
  console.log("ładowanie");
  this.isLoaded = true;
}
  
confirmTerm(element: any) { 
  if(this.isVisible == true){
    this.isVisible = false;
  } else {
    this.isVisible = true;
  }
  this.termDataBooking = element;
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

  this.termDataBooking.reason = textAreaValue;
  this.termDataBooking.login = login;
  console.log(this.termDataBooking);

  // dodawanie wpisu
  this.termListService.bookTerm(this.termDataBooking);
  this.closeBooking();
}
}


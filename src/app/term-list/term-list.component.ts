import { Component, OnInit } from '@angular/core';
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
  od_godziny: string;
  name: string;
  surname: string;
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
  allDataLoaded = false;

  //kolumny w tabeli terminów
  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
  doctorsDataSource = TERM_LIST;

  iterator = 0;
  sumeOfVisits = 0;

  //zmienne do rezerwacji wizyty
  termDataBooking: any;

  constructor(private termListService: TermListService, private editDoctorService: EditDoctorService, private authService: AuthService) { }

  ngOnInit() {
    this.getDoctorsData();
    // this.loadTerm();
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
        DOCTORS_DATA.push(element);
        
        // pobranie grafiku i listy terminów
        this.editDoctorService.getSchedule(this.login).subscribe((data) => {
          this.scheduleData = data;
          // console.log("data",data);
          //iterowanie po dniach zapisanych w grafiku lekarza
          this.scheduleData.forEach((element: ScheduleDataElement) => {
            // console.log("element", element);
            SCHEDULE_DATA.push(element)
            this.scheduleDataArray = SCHEDULE_DATA;

            //obliczanie ilosci wizyt aby stworzyc licznik do generowania
            // byćmoże po zarezerwowaniu wizyty sie wysypie bo będzie ich mniej generowało albo zrobić tak że wizyta będzie na szaro czy coś
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
                   for(let i=0; i<DOCTORS_DATA.length;i++){
                      if(DOCTORS_DATA[i].id_lekarza == element.id){
                        element.name = DOCTORS_DATA[i].name;
                        element.surname = DOCTORS_DATA[i].surname;
                        element.city = DOCTORS_DATA[i].city;
                        element.speciality = DOCTORS_DATA[i].speciality;
                      }
                    }
                  TERM_LIST.push(element);
                  // console.log("iterator", this.iterator);
                  // console.log("termDataLeng", this.termData.length);
                  if(this.iterator == this.sumeOfVisits){
                    console.log("ładowanie");
                    this.isLoaded = true;
                  }
              })
              this.termDataArray = TERM_LIST;
            });
          });
        });      
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


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
  // doctorsDataSource = DOCTORS_DATA;
  // doctorsDataSource = TERM_LIST;
  doctorsDataSource = TERM_LIST;

  iterator = 0;

  constructor(private termListService: TermListService, private editDoctorService: EditDoctorService) { }

  ngOnInit(): void {
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

            this.editDoctorService.getHourList(element.id_lekarza, element.data, element.od_godziny, element.do_godziny).subscribe((response) => {
              this.termData = response;
              // console.log("termData", this.termData.length);
              
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
                  if(this.iterator == 28){
                    console.log("ładowanie");
                    this.isLoaded = true;
                  }
              })
              this.termDataArray = TERM_LIST;
            });
          });
        });      
      });
    }
    // ,
    // (err) => console.error(err),
    // () => this.loadTerm()
    )
    console.log("DOCTORS_DATA", DOCTORS_DATA);
    console.log("SCHEDULE_DATA", SCHEDULE_DATA);
    console.log("TERM_LIST", TERM_LIST);
}

loadTerm() {
  console.log("ładowanie");
  this.isLoaded = true;
}
  
  confirmTerm() { 
    if(this.isVisible == true){
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }
  // getDoctorsData2() {
    //     TERM_LIST.splice(0, TERM_LIST.length);
    //     SCHEDULE_DATA.splice(0, DOCTORS_DATA.length);
    //     TERM_LIST.splice(0, SCHEDULE_DATA.length);
    
    //     this.termListService.getTermInfo().subscribe((data) => {
    //       for(let i=0; i<data.length; i++) {
    //         console.log("termlist element", data[i]);
    //         this.userID = data[i].id_lekarza;
    //         this.speciality = data[i].speciality;
    //         this.login = data[i].login;
    //         this.password = data[i].password;
    //         this.role = data[i].role;
    //         this.name = data[i].name;
    //         this.surname = data[i].surname;
    //         this.city = data[i].city; 
            
    //         // pobranie grafiku i listy terminów
    //         this.editDoctorService.getSchedule(this.login).subscribe((data) => {
    //           this.scheduleData = data;
    //           //iterowanie po dniach zapisanych w grafiku lekarza
    //           for(let j=0; j<this.scheduleData.length; j++){
    //             console.log("schedule element", this.scheduleData[j]);
                
    //             this.editDoctorService.getHourList(this.userID, this.scheduleData[j].data, this.scheduleData[j].od_godziny, this.scheduleData[j].do_godziny).subscribe((response) => {
    //               this.termData = response;
    //               // iterowanie po godzinach wyznaczonych jako termin na wizytę
    //               for(let k=0; k<this.termData;k++){
    //                 console.log("term element", this.termData[k]);
    //                 if(this.userID == this.termData[k].id){
    //                   this.termData[k].name = this.name;
    //                   this.termData[k].surname = this.surname;
    //                   this.termData[k].speciality = this.speciality;
    //                   this.termData[k].city = this.city;
    //                   TERM_LIST.push(this.termData[k]);
    //                 }
    //               }
    //               console.log("TERM LIST", TERM_LIST);
    //               this.termDataArray = TERM_LIST;
    //             });
    //             SCHEDULE_DATA.push(this.scheduleData[j])
    //           }
    //           this.scheduleDataArray = SCHEDULE_DATA;
    //         });      
    //       DOCTORS_DATA.push(data[i]);
    //       }
    //      this.isLoaded = true;
    //     })
    
    //     // console.log("DOCTORS_DATA", DOCTORS_DATA);
    //     // console.log("SCHEDULE_DATA", SCHEDULE_DATA);
    //     // console.log("TERM_LIST", TERM_LIST);
    // }
}

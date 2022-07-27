import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DoctorDataElement {
  id_lekarza: string;
  specjalnosc: string;
  miasto: string;
  login: string;
  haslo: string;
  imie: string;
  nazwisko: string;
  rola: string;
}

const DOCTORS_DATA: DoctorDataElement[] = [];

@Component({
  selector: 'app-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.css']
})
export class TermListComponent implements OnInit {
  userID = '';
  specialization = '';
  login = '';
  password = '';
  role = '';
  name = '';
  surname = '';
  city = '';
  isVisible = true;
  isLoaded = false;

  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
  doctorsDataSource = DOCTORS_DATA;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getDoctorsData();
  }

  confirmTerm() { 
    if(this.isVisible == true){
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  getDoctorsData() {
      DOCTORS_DATA.splice(0, DOCTORS_DATA.length);
      this.http.get<Array<DoctorDataElement>>('http://localhost:3001/doctor').subscribe((data) => {
        data.forEach (element => {
          DOCTORS_DATA.push(element);
          this.userID = element.id_lekarza;
          this.specialization = element.specjalnosc;
          this.login = element.login;
          this.password = element.haslo;
          this.role = element.rola;
          this.name = element.imie;
          this.surname = element.nazwisko;
          this.city = element.miasto      
      });      
      this.isLoaded = true;
      console.log(DOCTORS_DATA);
      
    })
  }

}

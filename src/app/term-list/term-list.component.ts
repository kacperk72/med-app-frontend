import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface PeriodicElement {
  name: string;
  surname: string;
  specialization: string[];
  city: string;
  time: string;
  icons: string;
}

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

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Jan', surname: "Kowalski", specialization: ['kardiolog'], city: "Kraków",  time: '15.07.2022 13.45', icons: " "},
  {name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", time: '15.07.2022 13.45', icons: " "},
  {name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", time: '15.07.2022 13.45', icons: " "},
  {name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", time: '15.07.2022 13.45', icons: " "},
  {name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", time: '15.07.2022 13.45', icons: " "},
  {name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog', 'psychiatra'], city: "Kraków", time: '15.07.2022 13.45', icons: " "},
];

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

  // displayedColumns: string[] = ['name', 'surname', 'specialization', 'city', 'time', 'icons'];
  // dataSource = ELEMENT_DATA;
  isVisible = true;

  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto'];
  // displayedData: string[] = ['imie'];
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
      this.http.get<Array<DoctorDataElement>>('http://localhost:3001/doctor').subscribe((data) => {
      // console.log(data);
      data.forEach (element => {
        DOCTORS_DATA.push(element);
        // console.log(element.id_lekarza);    
        this.userID = element.id_lekarza;
        this.specialization = element.specjalnosc;
        this.login = element.login;
        this.password = element.haslo;
        this.role = element.rola;
        this.name = element.imie;
        this.surname = element.nazwisko;
        this.city = element.miasto      
      });      
      console.log(DOCTORS_DATA);
      
    })
  }

}

import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  id: number;
  name: string;
  surname: string;
  specialization: string[];
  city: string;
  icons: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, name: 'Jan', surname: "Kowalski", specialization: ['kardiolog'], city: "Kraków", icons: " "},
  {id: 2, name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", icons: " "},
  {id: 3, name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", icons: " "},
  {id: 4, name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", icons: " "},
  {id: 5, name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog'], city: "Kraków", icons: " "},
  {id: 6, name: 'Jan', surname: "Kowalski", specialization: ['kardiolog', 'neurolog', 'psychiatra'], city: "Kraków", icons: " "},
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'surname', 'specialization', 'city', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

 
}

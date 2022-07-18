import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  surname: string;
  specialization: string[];
  city: string;
  time: string;
  icons: string;
}

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

  displayedColumns: string[] = ['name', 'surname', 'specialization', 'city', 'time', 'icons'];
  dataSource = ELEMENT_DATA;
  isVisible = true;

  constructor() { }

  ngOnInit(): void {
  }

  confirmTerm() { 
    if(this.isVisible == true){
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

}

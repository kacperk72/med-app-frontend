import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientService } from '../service/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  subscription1$!: Subscription;
  subscription2$!: Subscription;
  
  searchForm!: FormGroup;
  searchData = [''];
  searchRole: string = "";
  searchCity: string = "";
  searchDateFrom: string = "";
  searchDateTo: string = "";
  searchTimeFrom: string = "";
  // searchTimeTo: string = "";

  //widocznosc elementow
  isVisibleForm: boolean = true;
  renderList: boolean = false;

  //dane pobierane z bazy
  cities: any; //subscribe
  citiesArray: Array<Object> = [];
  specialities: any; //subscribe
  specArray: Array<string> = [];
  uniqueSpecArray: Array<string> = [];
  spec: string = "";
  specAr: Array<string> = [];

  constructor(private fb: FormBuilder, private patientService: PatientService) { }

  ngOnInit(): void {
    this.subscription1$ = this.patientService.getCities().subscribe(resp => {
      this.cities = resp;
      this.cities.forEach((el: { city: string; }) => {
        this.citiesArray.push(el.city)
      });
    })
  
    // jeżeli specjalizacje zostaną podane w innej formnie niż "jenda, druga" to sie wysypie
    this.subscription2$ = this.patientService.getSpec().subscribe(resp => {
      this.specialities = resp;
      this.specialities.forEach((el: { speciality: string; }) => {
        this.spec = el.speciality;
        this.specAr = this.spec.split(', ');
        this.specAr.forEach((el: string) => {
          // console.log(el);
          this.specArray.push(el)
        });
        this.uniqueSpecArray = [...new Set(this.specArray)];
        // console.log(this.uniqueSpecArray);
      });
    })

    this.searchForm = this.fb.group({
      role: this.searchRole,
      city: this.searchCity,
      dateFrom: this.searchDateFrom,
      dateTo: this.searchDateTo,
      timeFrom: this.searchTimeFrom,
      // timeTo: this.searchTimeTo, 
    });
  }

  // ngOnDestroy(){
  //   this.subscription1$.unsubscribe();
  //   this.subscription2$.unsubscribe();
  // }

  showList(){
    // debugger
    this.renderList =!this.renderList
  }

  save() {
    this.searchRole = this.searchForm.get('role')?.value;
    this.searchCity = this.searchForm.get('city')?.value;
    this.searchDateFrom = this.searchForm.get('dateFrom')?.value
    this.searchDateTo = this.searchForm.get('dateTo')?.value;
    this.searchTimeFrom = this.searchForm.get('timeFrom')?.value;
    // this.searchTimeTo = this.searchForm.get('timeTo')?.value;

    this.searchData = [this.searchRole, this.searchCity, this.searchDateFrom, this.searchDateTo, this.searchTimeFrom];
    // console.log(this.searchData);
    
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  searchForm!: FormGroup;
  searchData = [''];
  searchRole = "";
  searchCity = "";
  searchDateFrom = "";
  searchDateTo = "";
  searchTimeFrom = "";
  searchTimeTo = "";

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      role: [this.searchRole, Validators.required],
      city: [this.searchCity, [Validators.required]],
      dateFrom: [this.searchDateFrom,[Validators.required]],
      dateTo: [this.searchDateTo,[Validators.required]],
      timeFrom: [this.searchTimeFrom, [Validators.required]],
      timeTo: [this.searchTimeTo, [Validators.required]]
    });
  }

  save() {
    this.searchRole = this.searchForm.get('role')?.value;
    this.searchCity = this.searchForm.get('city')?.value;
    this.searchDateFrom = this.searchForm.get('dateFrom')?.value
    this.searchDateTo = this.searchForm.get('dateTo')?.value;
    this.searchTimeFrom = this.searchForm.get('timeFrom')?.value;
    this.searchTimeTo = this.searchForm.get('timeTo')?.value;

    this.searchData = [this.searchRole, this.searchCity, this.searchDateFrom, this.searchDateTo, this.searchTimeFrom, this.searchTimeTo];
    console.log(this.searchData);
    
  }

}

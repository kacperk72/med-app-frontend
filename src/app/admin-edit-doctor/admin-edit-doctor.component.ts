import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScheduleDataElement, TermListElement } from '../models/doctor-types';
import { EditDoctorService } from '../service/edit-doctor.service';

@Component({
  selector: 'app-admin-edit-doctor',
  templateUrl: './admin-edit-doctor.component.html',
  styleUrls: ['./admin-edit-doctor.component.css']
})
export class AdminEditDoctorComponent implements OnInit {

  //widocznosc w celu pobrania danych i poprawnego wygrnerowania
  isVisibleEdit = false;
  isLoaded: boolean = false;
  isLoadedSchedule: boolean = false;
  isVisibleAdd: boolean = false;

  // dane lekarza
  element: any;
  doctorID: string = "";
  spec: string = "";
  city: string = "";
  login: string = "";
  name: string = "";
  surname: string = "";

  //zmienne do przetwarzania wyświetlanych danych
  nameInputValue = '';
  surnameInputValue = '';
  specialityInputValue = '';
  cityInputValue = '';
  date: string = '';
  from_hour: string ='';
  to_hour: string ='';

  scheduleData: any;
  scheduleDataArray: ScheduleDataElement[] = [];
  termData: any;
  termDataArray: TermListElement[] = [];

  // formularz dodawania terminow
  addTermForm!: FormGroup;
  addDate: string = "";
  addTimeFrom: number = 0;
  addTimeTo: number = 0;

  // formularz edytowanie grafiku
  editTermForm!: FormGroup;
  editTermData!: ScheduleDataElement;
  editTimeFrom: number = 0;
  editTimeTo: number = 0;
  
  private subgetSchedule$!: Subscription;
  private subgetHourList$!: Subscription;
  private subaddTerm$!: Subscription;

  constructor(private route: ActivatedRoute, private editDoctorService: EditDoctorService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.scheduleDataArray = [];
    this.termDataArray = [];

    this.doctorID = this.route.snapshot.paramMap.get('id_lek') || "";
    this.spec = this.route.snapshot.paramMap.get('spec') || "";
    this.city = this.route.snapshot.paramMap.get('city') || "";
    this.login = this.route.snapshot.paramMap.get('login') || "";
    this.name = this.route.snapshot.paramMap.get('name') || "";
    this.surname = this.route.snapshot.paramMap.get('surname') || "";

    this.nameInputValue = this.name;
    this.surnameInputValue = this.surname;
    this.specialityInputValue = this.spec;
    this.cityInputValue = this.city;

    // pobranie grafiku i listy terminów
    this.subgetSchedule$ = this.editDoctorService.getSchedule(this.login).subscribe((data) => {
      this.scheduleData = data;
      //iterowanie po dniach zapisanych w grafiku lekarza
      this.scheduleData.forEach((element: ScheduleDataElement) => {
        this.scheduleDataArray.push(element)
        // console.log("element", element);
        this.subgetHourList$ = this.editDoctorService.getHourList(this.doctorID, element).subscribe((response) => {
          // console.log("response", response);
          this.termData = response;
          // iterowanie po godzinach wyznaczonych jako termin na wizytę
          this.termData.forEach((element: TermListElement) => {
            this.termDataArray.push(element);
          })
        });
      });
      this.isLoadedSchedule = true;
    });

    this.addTermForm = this.fb.group({
      date: [this.addDate, Validators.required],
      timeFrom: [this.addTimeFrom, Validators.required],
      timeTo: [this.addTimeTo, Validators.required]
    });
    this.isLoaded = true;
  }

  ngOnDestroy(){
    if(this.subgetSchedule$){
      this.subgetSchedule$.unsubscribe();
    }
    if(this.subgetHourList$){
      this.subgetHourList$.unsubscribe();
    }
    if(this.subaddTerm$){
      this.subaddTerm$.unsubscribe();
    }
  }

  updateDoctor(name: string, surname: string, speciality: string, city: string): void{
    this.editDoctorService.updateDoctorData(this.doctorID, name, surname, speciality, city).subscribe(res => {
      console.log("dane zapisane poprawnie");
    });
  }

  editTerm(term: ScheduleDataElement) {
    //  console.log(term);
     this.editTermData = term;
     this.editTermForm = this.fb.group({
       timeFrom: [this.editTimeFrom, Validators.required],
       timeTo: [this.editTimeTo, Validators.required]
     });
     
     this.isVisibleEdit =! this.isVisibleEdit;
  }

  deleteTerm(term: ScheduleDataElement){
    this.editDoctorService.deleteDoctorTerm(term.id_terminu).subscribe(resp => {
      console.log("usuwanie ", term.id_terminu);
    })
    window.location.reload();
  }

  saveEditTerm() {
    // console.log(this.editTermData);
    if(this.editTermForm.valid){
      this.editTimeFrom = this.editTermForm.get('timeFrom')?.value;
      this.editTimeTo = this.editTermForm.get('timeTo')?.value;
      // console.log(this.editTermData.id_terminu, this.editTimeFrom, this.editTimeTo);
      this.editDoctorService.updateDoctorTerm(this.editTermData.id_terminu, this.editTimeFrom, this.editTimeTo).subscribe(res => {
        console.log("dane zapisane poprawnie");
      });
      window.location.reload();
    }
  }

  closeEdit(){
    this.isVisibleEdit =! this.isVisibleEdit;
  }

  showTermAdd() {
    this.isVisibleAdd =! this.isVisibleAdd;
  }

  addTerm(){
    if(this.addTermForm.valid){
      this.addDate = this.addTermForm.get('date')?.value;
      this.addTimeFrom = this.addTermForm.get('timeFrom')?.value;
      this.addTimeTo = this.addTermForm.get('timeTo')?.value;
  
      let timeF;
      let timeT;
      let date = this.addDate + " 02:00:00";

      if(this.addTimeFrom <= 9)
        timeF = "0" + this.addTimeFrom  + ":00"
      else 
        timeF = this.addTimeFrom + ":00"
      if(this.addTimeTo <= 9)
        timeT = "0" + this.addTimeTo  + ":00"
      else 
        timeT = this.addTimeTo + ":00"

      this.subaddTerm$ = this.editDoctorService.addTerm(this.doctorID, date, timeF, timeT).subscribe((resp) => {
        console.log("dodano termin");
      })

      this.showTermAdd();
    }
  }

}

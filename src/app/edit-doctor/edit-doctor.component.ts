import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ScheduleDataElement, TermListElement, VisitElement } from '../models/doctor-types';
import { tokenElement } from '../models/token-types';
import { AuthService } from '../service/auth.service';
import { EditDoctorService } from '../service/edit-doctor.service';

const SCHEDULE_DATA: ScheduleDataElement[] = [];

const TERM_LIST: TermListElement[] = [];

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css'],
})
export class EditDoctorComponent implements OnInit {
  subscription1$!: Subscription;
  subscription2$!: Subscription;
  subscription3$!: Subscription;
  subscription4$!: Subscription;

  //widocznosc w celu pobrania danych i poprawnego wygrnerowania
  isVisibleEdit = false;
  isLoaded: boolean = false;
  isLoadedSchedule: boolean = false;
  isVisibleAdd: boolean = false;
  // zmienne na dane zwracane z bazy
  doctorData: any; //subscribe
  token: string = '';
  tokenJson!: tokenElement;
  scheduleData: any; //subscribe
  scheduleDataArray!: Array<ScheduleDataElement>;
  termData: any; //subscribe
  termDataArray!: Array<TermListElement>;

  // zmienne do przetwarzania wyświetlanych danych
  doctorLogin: string = '';
  doctorPassword: string = '';
  nameInputValue = '';
  surnameInputValue = '';
  specialityInputValue = '';
  cityInputValue = '';
  doctorID = '';
  // formularz dodawania terminow
  addTermForm!: FormGroup;
  addDate: string = "";
  addTimeFrom: number = 0;
  addTimeTo: number = 0;
  // zarezerwowane wizytty
  bookedHour: string = "";
  bookedName: string = "";
  bookedDate: string = "";
  termsWithoutBookedArray: any;
  // formularz edytowanie grafiku
  editTermForm!: FormGroup;
  editTermData: any;
  editTimeFrom: number = 0;
  editTimeTo: number = 0;

  constructor(private authService: AuthService, private editDoctorService: EditDoctorService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // pobranie danych doktora z tokenu
    this.token = this.authService.GetToken();
    this.tokenJson = this.authService.GetRolebyToken(this.token);
    this.doctorLogin = this.tokenJson.login;
    this.doctorPassword = this.tokenJson.password;

    // pobranie danych doktora z bazy
    this.subscription4$ = this.editDoctorService.getOneDoctor(this.doctorLogin).subscribe((data) => {
      this.doctorData = data;
      // console.log(this.doctorData);
      if(this.doctorData != []){
        this.doctorID = this.doctorData.id_lekarza;
        this.nameInputValue = this.doctorData.name;
        this.surnameInputValue = this.doctorData.surname;
        this.specialityInputValue = this.doctorData.speciality;
        this.cityInputValue = this.doctorData.city;

        this.getSchedule();

        this.isLoaded = true;
      } else {
        console.log("wystąpił błąd pobierania danych z bazy");
      }
    });

    console.log("SCHEDULE_DATA", SCHEDULE_DATA);
    console.log("TERM_DATA", TERM_LIST);
    
  }

  // ngOnDestroy(){
  //   this.subscription1$.unsubscribe();
  //   this.subscription2$.unsubscribe();
  //   this.subscription3$.unsubscribe();
  //   this.subscription4$.unsubscribe();
  // }

  async getSchedule(){
    // pobranie grafiku i listy terminów
    this.subscription1$ = this.editDoctorService.getSchedule(this.doctorLogin).subscribe((data) => {
    this.scheduleData = data;
    //iterowanie po dniach zapisanych w grafiku lekarza
    this.scheduleData.forEach((element: ScheduleDataElement) => {
      SCHEDULE_DATA.push(element)
      // console.log("element", element);
      this.subscription2$ = this.editDoctorService.getHourList(this.doctorID, element.data, element.od_godziny, element.do_godziny, element.id_terminu).subscribe((response) => {
        // console.log("response", response);
        this.termData = response;
        // iterowanie po godzinach wyznaczonych jako termin na wizytę
        this.termData.forEach((element: TermListElement) => {
          TERM_LIST.push(element);
        })
        this.termDataArray = TERM_LIST;

      });
    });
    this.scheduleDataArray = SCHEDULE_DATA;
    this.isLoadedSchedule = true;
    });
    this.addTermForm = this.fb.group({
      date: [this.addDate, Validators.required],
      timeFrom: [this.addTimeFrom, Validators.required],
      timeTo: [this.addTimeTo, Validators.required]
    });
  }

  updateDoctor(name: string, surname: string, speciality: string, city: string): void{
    this.editDoctorService.updateDoctorData(this.doctorID, name, surname, speciality, city);
  }

  editTerm(term: ScheduleDataElement) {
    // console.log(term);
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
    console.log(this.editTermData);
    if(this.editTermForm.valid){
      this.editTimeFrom = this.editTermForm.get('timeFrom')?.value;
      this.editTimeTo = this.editTermForm.get('timeTo')?.value;
      // console.log(this.editTermData.id_terminu, this.editTimeFrom, this.editTimeTo);
      this.editDoctorService.updateDoctorTerm(this.editTermData.id_terminu, this.editTimeFrom, this.editTimeTo)
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

      this.subscription3$ = this.editDoctorService.addTerm(this.doctorID, date, timeF, timeT).subscribe((resp) => {
        console.log("dodano termin");
        window.location.reload();
      })

      this.showTermAdd();
    }
  }

}


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScheduleDataElement, TermListElement } from '../models/doctor-types';
import { EditDoctorService } from '../service/edit-doctor.service';

const SCHEDULE_DATA: ScheduleDataElement[] = [];

const TERM_LIST: TermListElement[] = [];

@Component({
  selector: 'app-admin-edit-doctor',
  templateUrl: './admin-edit-doctor.component.html',
  styleUrls: ['./admin-edit-doctor.component.css']
})
export class AdminEditDoctorComponent implements OnInit {
  subscription1$!: Subscription;
  subscription2$!: Subscription;
  subscription3$!: Subscription;

  //widocznosc w celu pobrania danych i poprawnego wygrnerowania
  isVisibleEdit = false;
  isLoaded: boolean = false;
  isLoadedSchedule: boolean = false;
  isVisibleAdd: boolean = false;

  // dane lekarza
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
  scheduleDataArray: Array<ScheduleDataElement> = [];
  termData: any;
  termDataArray: Array<TermListElement> = [];

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

    // console.log(this.id_lek, this.spec, this.city, this.login, this.name, this.surname);

    this.nameInputValue = this.name;
    this.surnameInputValue = this.surname;
    this.specialityInputValue = this.spec;
    this.cityInputValue = this.city;
    

    // pobranie grafiku i listy terminów
    this.subscription1$ = this.editDoctorService.getSchedule(this.login).subscribe((data) => {
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
        });;
      });
      this.scheduleDataArray = SCHEDULE_DATA;
      this.isLoadedSchedule = true;
    });

    this.addTermForm = this.fb.group({
      date: [this.addDate, Validators.required],
      timeFrom: [this.addTimeFrom, Validators.required],
      timeTo: [this.addTimeTo, Validators.required]
    });

    this.isLoaded = true;
  }

  // ngOnDestroy(){
  //   this.subscription1$.unsubscribe();
  //   this.subscription2$.unsubscribe();
  //   this.subscription3$.unsubscribe();
  // }

  updateDoctor(name: string, surname: string, speciality: string, city: string): void{
    this.editDoctorService.updateDoctorData(this.doctorID, name, surname, speciality, city);
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
      })

      this.showTermAdd();
    }
  }

}

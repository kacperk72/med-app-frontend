import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EditDoctorService } from '../service/edit-doctor.service';

export interface ScheduleDataElement{
  id_lekarza: string;
  id_terminu: string;
  data: string;
  od_godziny: string;
  do_godziny: string;
}

export interface TermListElement{
  data:string;
  od_godziny: string;
}

const SCHEDULE_DATA: ScheduleDataElement[] = [];

const TERM_LIST: TermListElement[] = [];

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
  id_lek: any = "";
  spec: any = "";
  city: any = "";
  login: any = "";
  name: any = "";
  surname: any = "";

  //zmienne do przetwarzania wyświetlanych danych
  nameInputValue = '';
  surnameInputValue = '';
  specialityInputValue = '';
  cityInputValue = '';
  date:any;
  from_hour:any;
  to_hour:any;

  scheduleData: any;
  scheduleDataArray: any;
  termData: any;
  termDataArray: any;

  // formularz dodawania terminow
  addTermForm!: FormGroup;
  addDate: string = "";
  addTimeFrom: number = 0;
  addTimeTo: number = 0;
  addData: any;

  constructor(private route: ActivatedRoute, private editDoctorService: EditDoctorService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.scheduleDataArray = [];
    this.termDataArray = [];

    this.id_lek = this.route.snapshot.paramMap.get('id_lek');
    this.spec = this.route.snapshot.paramMap.get('spec');
    this.city = this.route.snapshot.paramMap.get('city');
    this.login = this.route.snapshot.paramMap.get('login');
    this.name = this.route.snapshot.paramMap.get('name');
    this.surname = this.route.snapshot.paramMap.get('surname');

    // console.log(this.id_lek, this.spec, this.city, this.login, this.name, this.surname);

    this.nameInputValue = this.name;
    this.surnameInputValue = this.surname;
    this.specialityInputValue = this.spec;
    this.cityInputValue = this.city;
    

    // pobranie grafiku i listy terminów
    this.editDoctorService.getSchedule(this.login).subscribe((data) => {
      this.scheduleData = data;
      //iterowanie po dniach zapisanych w grafiku lekarza
      this.scheduleData.forEach((element: ScheduleDataElement) => {
        SCHEDULE_DATA.push(element)
        // console.log("element", element);
        this.editDoctorService.getHourList(this.id_lek, element.data, element.od_godziny, element.do_godziny, element.id_terminu).subscribe((response) => {
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

  updateDoctor(name: string, surname: string, speciality: string, city: string): void{
    this.editDoctorService.updateDoctorData(this.id_lek, name, surname, speciality, city);
  }

  editTerm() {
    if(this.isVisibleEdit == true){
      this.isVisibleEdit = false;
    } else {
      this.isVisibleEdit = true;
    }
  }

  showTermAdd() {
    if(this.isVisibleAdd == false){
      this.isVisibleAdd = true;
    } else {
      this.isVisibleAdd = false;
    }  }

  addTerm(){
    if(this.addTermForm.valid){
      this.addDate = this.addTermForm.get('date')?.value;
      this.addTimeFrom = this.addTermForm.get('timeFrom')?.value;
      this.addTimeTo = this.addTermForm.get('timeTo')?.value;
  
      // this.addData = [this.addDate, this.addTimeFrom, this.addTimeTo];
      // console.log(this.addData);

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

      this.editDoctorService.addTerm(this.id_lek, date, timeF, timeT).subscribe((resp) => {
        console.log("dodano termin");
      })

      this.showTermAdd();
    }
  }

}

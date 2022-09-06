import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DoctorDataElement, ScheduleDataElement } from '../models/doctor-types';
import { PacientBookTermElement } from '../models/pacient-types';
import { TermElement } from '../models/term-types';
import { AuthService } from '../service/auth.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { TermListService } from '../service/term-list.service';

@Component({
    selector: 'app-term-list',
    templateUrl: './term-list.component.html',
    styleUrls: ['./term-list.component.css']
})
export class TermListComponent implements OnInit, OnDestroy {
  @Input()
      searchForm!: FormGroup;

  @ViewChild(MatPaginator)
      paginator!: MatPaginator;

  userID = '';
  speciality = '';
  login = '';
  password = '';
  role = '';
  name = '';
  surname = '';
  city = '';
  term = '';

  // zmienne na dane zwracane z bazy
  scheduleData: any;
  scheduleDataArray: ScheduleDataElement[] = [];
  termData: any;
  termDataArray!: MatTableDataSource<TermElement>;
  doctorDataArray: DoctorDataElement[] = [];
  termListArray: TermElement[] = [];
  // zmienne do załadowania danych do komponentów
  isVisible = true;
  isLoaded = true;

  //kolumny w tabeli terminów
  displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
  doctorsDataSource = this.termListArray;

  //zmienne do rezerwacji wizyty
  termDataBooking!: PacientBookTermElement;

  //zmienne z fomularza do filtrowania wyników
  searchRole = '';
  searchCity = '';
  searchDateFrom = '';
  searchDateTo = '';
  searchTimeFrom = '';
  searchData = [''];

  private subgetTermInfo$!: Subscription;
  private subgetSchedule$!: Subscription;
  private subgetHourList$!: Subscription;

  constructor(private termListService: TermListService, private editDoctorService: EditDoctorService, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {

      this.searchRole = this.searchForm.get('role')?.value;
      this.searchCity = this.searchForm.get('city')?.value;
      this.searchDateFrom = this.searchForm.get('dateFrom')?.value;
      this.searchDateTo = this.searchForm.get('dateTo')?.value;
      this.searchTimeFrom = this.searchForm.get('timeFrom')?.value;
      this.searchData = [this.searchRole, this.searchCity, this.searchDateFrom, this.searchDateTo, this.searchTimeFrom];

      this.searchForm = this.fb.group({
          role: this.searchRole,
          city: this.searchCity,
          dateFrom: this.searchDateFrom,
          dateTo: this.searchDateTo,
          timeFrom: this.searchTimeFrom,
          // timeTo: this.searchTimeTo,
      });

      this.getDoctors();
  }

  ngOnDestroy(): void{
      if(this.subgetTermInfo$){
          this.subgetTermInfo$.unsubscribe();
      }
      if(this.subgetSchedule$){
          this.subgetSchedule$.unsubscribe();
      }
      if(this.subgetHourList$){
          this.subgetHourList$.unsubscribe();
      }
  }

  getDoctors(): void{
      this.termListArray.splice(0, this.termListArray.length);

      this.subgetTermInfo$ = this.termListService.getTermInfo().subscribe((data) => {
          data.forEach(element => {
              // console.log("doktor element", element);
              this.userID = element.id_lekarza;
              // this.speciality = element.speciality;
              this.login = element.login;
              this.password = element.password;
              this.role = element.role;
              this.name = element.name;
              this.surname = element.surname;
              this.city = element.city;

              // sprawdzam czy w formularzu była jego specjalizacja
              if(element.speciality.includes(this.searchRole) || this.searchRole === ''){
                  if(this.searchCity.includes(element.city) || this.searchCity === '') {
                      this.doctorDataArray.push(element);
                      this.getSchedule();
                  }
              }
          });
      });
      // console.log('DOCTORS_DATA_ARRAY', this.doctorDataArray);
      // console.log('SCHEDULE_DATA_ARRAY', this.scheduleDataArray);
      // console.log('TERM_LIST_ARRAY', this.termListArray);
  }

  // pobranie grafiku i listy terminów
  getSchedule(): void{
      this.subgetSchedule$ = this.editDoctorService.getSchedule(this.login).subscribe((data) => {
          this.scheduleData = data;
          //iterowanie po dniach zapisanych w grafiku lekarza
          this.scheduleData.forEach((element: ScheduleDataElement) => {
              // sprawdzam czy data zawiera sie w podanych widełkach formularza
              if(new Date(element.data.split('T')[0]) >= new Date(this.searchDateFrom) && new Date(element.data.split('T')[0]) <= new Date(this.searchDateTo) || (this.searchDateFrom === '' && this.searchDateTo === '')){
                  this.scheduleDataArray.push(element);
                  this.subgetHourList$ = this.editDoctorService.getHourList(element.id_lekarza, element).subscribe((response) => {
                      this.termData = response;

                      // iterowanie po godzinach wyznaczonych jako termin na wizytę
                      this.termData.forEach((termEl: TermElement) => {
                          // sprawdzam czy godzina wizyty zawiera sie w widełkach formularza
                          if(termEl.godzina_wizyty >= (this.searchTimeFrom + ':00') || this.searchTimeFrom === '') {
                              for(const doctorDataElement of this.doctorDataArray){
                                  if(doctorDataElement.id_lekarza === termEl.id){
                                      termEl.name = doctorDataElement.name;
                                      termEl.surname = doctorDataElement.surname;
                                      termEl.city = doctorDataElement.city;
                                      termEl.speciality = doctorDataElement.speciality.join();
                                  }
                              }
                              this.termListArray.push(termEl);
                          }
                      });
                      this.setPaginator();
                  });
              }
          });
      });
  }

  setPaginator(): void{
      this.termListArray.sort(function (a,b){
          return Number(new Date(a.date)) - Number(new Date(b.date));
      });

      this.termDataArray = new MatTableDataSource(this.termListArray);
      this.termDataArray.paginator = this.paginator;
      this.isLoaded = true;
  }

  confirmTerm(element: PacientBookTermElement): void{
      if(this.isVisible === true){
          this.isVisible = false;
      } else {
          this.isVisible = true;
      }
      this.termDataBooking = element;
      console.log(this.termDataBooking);

  }

  closeBooking(): void{
      this.isVisible = true;
  }

  // rezerwacja wizyty
  bookTerm(): void{
      let textAreaValue;
      const token = this.authService.GetToken();
      const tokenJson = this.authService.GetRolebyToken(token);
      const login = tokenJson.login;

      if(document.querySelector('#textArea')){
          textAreaValue = document.querySelector<HTMLInputElement>('#textArea')?.value;
      }

      this.termDataBooking.reason = textAreaValue || '';
      this.termDataBooking.login = login;
      // console.log(this.termDataBooking);

      // dodawanie wpisu
      this.termListService.bookTerm(this.termDataBooking).subscribe(() => {
          console.log('dodano wizyte');
      });
      this.closeBooking();
      window.location.reload();
      window.alert('Rezerwacja zakończona sukcesem!');
  }
}

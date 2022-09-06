import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ScheduleDataElement, TermListElement } from '../models/doctor-types';
import { tokenElement } from '../models/token-types';
import { AuthService } from '../service/auth.service';
import { EditDoctorService } from '../service/edit-doctor.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-edit-doctor',
    templateUrl: './edit-doctor.component.html',
    styleUrls: ['./edit-doctor.component.css'],
})
export class EditDoctorComponent implements OnInit, OnDestroy {

    //widocznosc w celu pobrania danych i poprawnego wygrnerowania
    isVisibleEdit = false;
    isLoaded = false;
    isLoadedSchedule = false;
    isVisibleAdd = false;
    // zmienne na dane zwracane z bazy
    doctorData: any; //subscribe
    token = '';
    tokenJson!: tokenElement;
    scheduleData: any; //subscribe
    scheduleDataArray: ScheduleDataElement[] = [];
    termData: any; //subscribe
    termDataArray: TermListElement[] = [];

    // zmienne do przetwarzania wyświetlanych danych
    doctorLogin = '';
    doctorPassword = '';
    nameInputValue = '';
    surnameInputValue = '';
    specialityInputValue = '';
    cityInputValue = '';
    doctorID = '';
    // formularz dodawania terminow
    addTermForm!: FormGroup;
    addDate = '';
    addTimeFrom = 0;
    addTimeTo = 0;
    // formularz edytowanie grafiku
    editTermForm!: FormGroup;
    editTermData: any;
    editTimeFrom = 0;
    editTimeTo = 0;

    private subgetSchedule$!: Subscription;
    private subgetHourList$!: Subscription;
    private subaddTerm$!: Subscription;
    private subgetOneDoctor$!: Subscription;

    constructor(private authService: AuthService, private editDoctorService: EditDoctorService, private fb: FormBuilder) { }

    ngOnInit(): void {
    // pobranie danych doktora z tokenu
        this.token = this.authService.GetToken();
        this.tokenJson = this.authService.GetRolebyToken(this.token);
        this.doctorLogin = this.tokenJson.login;
        this.doctorPassword = this.tokenJson.password;

        // pobranie danych doktora z bazy
        this.subgetOneDoctor$ = this.editDoctorService.getOneDoctor(this.doctorLogin).subscribe((data) => {
            this.doctorData = data;
            // console.log(this.doctorData);
            if(this.doctorData !== []){
                this.doctorID = this.doctorData.id_lekarza;
                this.nameInputValue = this.doctorData.name;
                this.surnameInputValue = this.doctorData.surname;
                this.specialityInputValue = this.doctorData.speciality;
                this.cityInputValue = this.doctorData.city;

                this.getSchedule();

                this.isLoaded = true;
            } else {
                console.log('wystąpił błąd pobierania danych z bazy');
            }
        });
    }

    ngOnDestroy(): void{
        if(this.subgetSchedule$) {
            this.subgetSchedule$.unsubscribe();
        }
        if(this.subgetHourList$) {
            this.subgetHourList$.unsubscribe();
        }
        if(this.subaddTerm$) {
            this.subaddTerm$.unsubscribe();
        }
        if(this.subgetOneDoctor$) {
            this.subgetOneDoctor$.unsubscribe();
        }
    }

    async getSchedule(): Promise<void>{
    // pobranie grafiku i listy terminów
        this.subgetSchedule$ = this.editDoctorService.getSchedule(this.doctorLogin).subscribe((data) => {
            this.scheduleData = data;
            //iterowanie po dniach zapisanych w grafiku lekarza
            this.scheduleData.forEach((element: ScheduleDataElement) => {
                this.scheduleDataArray.push(element);
                // console.log("element", element);
                this.subgetHourList$ = this.editDoctorService.getHourList(this.doctorID, element).subscribe((response) => {
                    // console.log("response", response);
                    this.termData = response;
                    // iterowanie po godzinach wyznaczonych jako termin na wizytę
                    this.termData.forEach((termEl: TermListElement) => {
                        this.termDataArray.push(termEl);
                    });
                });
            });
            this.isLoadedSchedule = true;
        });
        this.addTermForm = this.fb.group({
            date: [this.addDate, Validators.required],
            timeFrom: [this.addTimeFrom, Validators.required],
            timeTo: [this.addTimeTo, Validators.required]
        });
    }

    updateDoctor(name: string, surname: string, speciality: string, city: string): void{
        this.editDoctorService.updateDoctorData(this.doctorID, name, surname, speciality, city).subscribe(res => {
            console.log('dane zapisane poprawnie');
        });
    }

    editTerm(term: ScheduleDataElement): void{
    // console.log(term);
        this.editTermData = term;
        this.editTermForm = this.fb.group({
            timeFrom: [this.editTimeFrom, Validators.required],
            timeTo: [this.editTimeTo, Validators.required]
        });

        this.isVisibleEdit =! this.isVisibleEdit;
    }
    deleteTerm(term: ScheduleDataElement): void{
        this.editDoctorService.deleteDoctorTerm(term.id_terminu).subscribe(resp => {
            console.log('usuwanie ', term.id_terminu);
        });
        window.location.reload();
    }

    saveEditTerm(): void{
        console.log(this.editTermData);
        if(this.editTermForm.valid){
            this.editTimeFrom = this.editTermForm.get('timeFrom')?.value;
            this.editTimeTo = this.editTermForm.get('timeTo')?.value;
            // console.log(this.editTermData.id_terminu, this.editTimeFrom, this.editTimeTo);
            this.editDoctorService.updateDoctorTerm(this.editTermData.id_terminu, this.editTimeFrom, this.editTimeTo).subscribe(res => {
                console.log('dane zapisane poprawnie');
            });
            window.location.reload();
        }
    }

    closeEdit(): void{
        this.isVisibleEdit =! this.isVisibleEdit;
    }

    showTermAdd(): void{
        this.isVisibleAdd =! this.isVisibleAdd;
    }

    addTerm(): void{
        if(this.addTermForm.valid){
            this.addDate = this.addTermForm.get('date')?.value;
            this.addTimeFrom = this.addTermForm.get('timeFrom')?.value;
            this.addTimeTo = this.addTermForm.get('timeTo')?.value;

            let timeF;
            let timeT;
            const date = this.addDate + ' 02:00:00';

            if(this.addTimeFrom <= 9)
            {timeF = '0' + this.addTimeFrom  + ':00';}
            else
            {timeF = this.addTimeFrom + ':00';}
            if(this.addTimeTo <= 9)
            {timeT = '0' + this.addTimeTo  + ':00';}
            else
            {timeT = this.addTimeTo + ':00';}

            this.subaddTerm$ = this.editDoctorService.addTerm(this.doctorID, date, timeF, timeT).subscribe((resp) => {
                console.log('dodano termin');
                window.location.reload();
            });

            this.showTermAdd();
        }
    }

}


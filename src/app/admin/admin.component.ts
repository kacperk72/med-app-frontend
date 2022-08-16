import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCellDef } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, tap, Observable, Subscription } from 'rxjs';
import { DoctorDataElement, EditDoctorElement, PeriodicElement } from '../models/doctor-types';
import { AdminService } from '../service/admin.service';




@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  elementData$: Observable<PeriodicElement[]> = this.adminService.getDoctorsData().pipe(tap((elem)=> {this.isLoaded = true;}));

  subscription1$!: Subscription;
  subscription2$!: Subscription
  subscription3$!: Subscription

  addDoctorForm!: FormGroup;

  displayedColumns: string[] = ['id_lekarza', 'name', 'surname', 'speciality', 'city', 'icons'];
  // dataSource = ELEMENT_DATA;
  isVisibleAdd = true;
  isLoaded = false;

  doctorData = {};
  userId = '';
  role = 'lekarz';
  userName!: string;
  userSurname!: string;
  userLogin!: string
  userPassword!: string
  city!: string;
  speciality!: string;
  doctorDataJson: any;

  editPanel: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private adminService: AdminService ) { }

  ngOnInit(): void {
    this.addDoctorForm = this.fb.group({
      name: [this.userName, Validators.required],
      surname: [this.userSurname, Validators.required],
      login: [this.userLogin, [Validators.required, Validators.minLength(3)]],
      password: [this.userPassword, [Validators.required, Validators.minLength(4)]],
      city: [this.city, Validators.required],
      speciality: [this.speciality, Validators.required]
    })
  }

  ngOnDestroy(){
    if(!!this.subscription1$) {
      this.subscription1$.unsubscribe();
    }

    if(!!this.subscription2$) {
      this.subscription2$.unsubscribe();
    }

    if(!!this.subscription3$) {
      this.subscription3$.unsubscribe();
    }
  }

  addDoctor() {
    this.isVisibleAdd =! this.isVisibleAdd;
  }

  addDoctorDB() {
    if(this.isVisibleAdd == true){
      this.isVisibleAdd = false;
    } else {
      this.isVisibleAdd = true;
    }
    this.userName = this.addDoctorForm.get('name')?.value;
    this.userSurname = this.addDoctorForm.get('surname')?.value;
    this.userLogin = this.addDoctorForm.get('login')?.value;
    this.userPassword = this.addDoctorForm.get('password')?.value;
    this.city = this.addDoctorForm.get('city')?.value;
    this.speciality = this.addDoctorForm.get('speciality')?.value;

    this.doctorData = {id: this.userId, name: this.userName, surname: this.userSurname, login: this.userLogin, password: this.userPassword, role: this.role, city: this.city, speciality: this.speciality}

    this.subscription2$ = this.adminService.addDoctor(this.doctorData).subscribe(response => {
      console.log(response);
    });

    window.location.reload();
  }

  openEditPanel(element: EditDoctorElement){
    const id_lek = element.user_id;
    const spec = element.speciality.join();
    const city = element.city;
    const login = element.login;
    const name = element.name;
    const surname = element.surname;

    this.router.navigate(['/adminEditDoctor', id_lek, spec, city, login, name, surname])
  }

  deleteDoctor(element: EditDoctorElement){
    const id_lek = element.user_id;

    if(window.confirm("Napewno chcesz usunąć?")){
      this.subscription3$ = this.adminService.deleteDoctor(id_lek).subscribe(resp => {
        console.log("delete succesfuly", resp);
      })
    }
    
    window.location.reload();
  }
 
}

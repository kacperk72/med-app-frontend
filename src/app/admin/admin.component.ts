import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

export interface PeriodicElement {
  id_lekarza: string;
  name: string;
  surname: string;
  speciality: string[];
  city: string;
  icons: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {
  addDoctorForm!: FormGroup;

  displayedColumns: string[] = ['id_lekarza', 'name', 'surname', 'speciality', 'city', 'icons'];
  dataSource = ELEMENT_DATA;
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
    this.getDoctorsData();

    this.addDoctorForm = this.fb.group({
      name: [this.userName, Validators.required],
      surname: [this.userSurname, Validators.required],
      login: [this.userLogin, [Validators.required, Validators.minLength(3)]],
      password: [this.userPassword, [Validators.required, Validators.minLength(4)]],
      city: [this.city, Validators.required],
      speciality: [this.speciality, Validators.required]
    })
  }

  getDoctorsData() {
    ELEMENT_DATA.splice(0, ELEMENT_DATA.length);
    this.adminService.getDoctorsData().subscribe(response => {
      // console.log(response);
      this.doctorDataJson = response;

      this.doctorDataJson.forEach((element: PeriodicElement) => {
        // console.log("dodaje do tablicy");
        element.id_lekarza = element.id_lekarza.slice(0,7)
        ELEMENT_DATA.push(element);
      });
      this.isLoaded = true;
    })
  }

  addDoctor() {
    if(this.isVisibleAdd == true){
      this.isVisibleAdd = false;
    } else {
      this.isVisibleAdd = true;
    }
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

    // console.log(this.doctorData);
    this.adminService.addDoctor(this.doctorData).subscribe(response => {
      console.log(response);
    });

    // window.location.reload();
  }

  openEditPanel(element: any){
    // console.log(element);
    const id_lek = element.user_id;
    const spec = element.speciality;
    const city = element.city;
    const login = element.login;
    const name = element.name;
    const surname = element.surname;

    this.router.navigate(['/adminEditDoctor', id_lek, spec, city, login, name, surname])
    // this.router.navigate('')    
  }

  deleteDoctor(element: any){
    const id_lek = element.user_id;

    if(window.confirm("Napewno chcesz usunąć?")){
      this.adminService.deleteDoctor(id_lek).subscribe(resp => {
        console.log("delete succesfuly", resp);
      })
    }
    
    window.location.reload();
  }
 
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selected = 'pacjent';
  daneUsera = {};
  userId = '';
  userName = '';
  userSurname ='';
  userLogin = '';
  userPassword = '';
  userRole = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [this.userName, Validators.required],
      surname: [this.userSurname, Validators.required],
      login: [this.userLogin, [Validators.required, Validators.minLength(3)]],
      password: [this.userPassword, [Validators.required, Validators.minLength(4)]],
      role: [this.userRole, Validators.required]
    })
  }

  register() {
    this.userName = this.registerForm.get('name')?.value;
    this.userSurname = this.registerForm.get('surname')?.value;
    this.userLogin = this.registerForm.get('login')?.value;
    this.userPassword = this.registerForm.get('password')?.value;
    this.userRole = this.registerForm.get('role')?.value;


    this.daneUsera = {id: this.userId, name: this.userName, surname: this.userSurname, login: this.userLogin, password: this.userPassword, role: this.userRole}

    this.http.post("http://localhost:3001/user/register", this.daneUsera).subscribe(response => {
      console.log(response);
      //TODO: jakos trzeba poinformować użytkownika że podany login juz istnieje
    });
  }

}

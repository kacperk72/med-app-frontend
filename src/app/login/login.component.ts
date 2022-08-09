import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {
  subscription1$!: Subscription;

  loginForm!: FormGroup;
  loginData = {};
  userLogin = '';
  userPassword = '';
  responsedata: any;
  actualRole = '';

  constructor(private fb: FormBuilder, private service: AuthService, private router: Router) { 
    localStorage.clear();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: [this.userLogin, Validators.required],
      password: [this.userPassword, Validators.required]
    })
  }

  // ngOnDestroy(){
  //   this.subscription1$.unsubscribe();
  // }

  logging() {
    this.userLogin = this.loginForm.get('login')?.value;
    this.userPassword = this.loginForm.get('password')?.value;
    this.loginData = {login: this.userLogin, password: this.userPassword}
    // console.log("this.loginData", this.loginData);
    
    this.subscription1$ = this.service.proceedLogin(this.loginData).subscribe(response => {
      if(response!=null){
        this.responsedata = response;
        // console.log(this.responsedata);
        this.actualRole = this.responsedata.result.role;
        // console.log(this.actualRole);
        localStorage.setItem('token', this.responsedata.token);
        localStorage.setItem('rola', this.actualRole);
        this.router.navigate(['/']);
      } else {
        window.alert("nieudana próba logowania")
      }
    }); 
  }
}

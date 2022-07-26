import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'med-app';
  role = '';

  constructor(public service: AuthService, private router: Router){ 
    
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('rola')||'';
    
  }
}

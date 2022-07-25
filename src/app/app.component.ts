import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public login: LoginComponent){}

  title = 'med-app';
}

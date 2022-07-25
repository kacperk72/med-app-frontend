import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service: AuthService, private route: Router) {}

  canActivate(){
    if(this.service.IsLoggedIn()){
      return true;
    } else {
      this.route.navigate(["/zaloguj"]);
      return false;
    }
  }
  
}

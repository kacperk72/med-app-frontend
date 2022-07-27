import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  proceedLogin(usercred: any){
    return this.http.post<{token: string}>("http://localhost:3001/user/login", usercred);
  }

  IsLoggedIn(){
    return localStorage.getItem('token')!=null;
  }

  GetToken(){
    return localStorage.getItem('token')||'';
  }

  Logout() {
    window.alert('Wylogowano');
    localStorage.clear();
    this.router.navigate(['/zaloguj']);
  }

  GetRolebyToken(token: any) {
    if( token != ''){
      const _extractedtoken = token.split('.')[1];
      const atobData = atob(_extractedtoken);
      const _finalData = JSON.parse(atobData);
      return _finalData;
    } else {
      console.log("Brak tokenu");
      return false;
    }
  }

  HaveAccessAdmin(){
    const loggingtoken = this.GetToken();
    const _finalData = this.GetRolebyToken(loggingtoken);
    if(_finalData.role == 'admin') {
      return true;
    }
    window.alert('Brak dostępu');
    return false;
  }

  HaveAccessPacient() {
    const loggingtoken = this.GetToken();
    const _finalData = this.GetRolebyToken(loggingtoken);
    if(_finalData.role == 'pacjent' || _finalData.role == 'admin') {
      return true;
    }
    window.alert('Zaloguj się aby sprawdzić umówione wizyty');
    return false;
  }

  HaveAccessDoctor() {
    const loggingtoken = this.GetToken();
    const _finalData = this.GetRolebyToken(loggingtoken);
    if(_finalData.role == 'lekarz' || _finalData.role == 'admin') {
      return true;
    }
    window.alert('Zaloguj się aby edytować swoje dane i zarządzać terminami');
    return false;
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  proceedLogin(usercred: any){
    return this.http.post<{token: string}>("http://localhost:3001/user/login", usercred);
  }

  IsLoggedIn(){
    return localStorage.getItem('token')!=null;
  }

  GetToken(){
    return localStorage.getItem('token')||'';
  }

  HaveAccressAdmin(){
    const loggingtoken = this.GetToken();
    console.log("loggingtoken", loggingtoken);
    if(loggingtoken != ''){
      const _extractedtoken=loggingtoken.split('.')[1];
      const atobData = atob(_extractedtoken);
      console.log("_extractedtoken", atobData);
      const _finalData = JSON.parse(atobData);
      console.log("finalData", _finalData);
      if(_finalData.role == 'admin') {
        return true;
      }
    }
    window.alert('Brak dostępu');
    return false;
  }

  HaveAccessPacient() {
    const loggingtoken = this.GetToken();
    if(loggingtoken != ''){
      const _extractedtoken=loggingtoken.split('.')[1];
      const atobData = atob(_extractedtoken);
      const _finalData = JSON.parse(atobData);
      if(_finalData.role == 'pacjent') {
        return true;
      }
    }
    window.alert('Zaloguj się aby sprawdzić umówione wizyty');
    return false;
  }

  HaveAccessDoctor() {
    const loggingtoken = this.GetToken();
    if(loggingtoken != ''){
      const _extractedtoken=loggingtoken.split('.')[1];
      const atobData = atob(_extractedtoken);
      const _finalData = JSON.parse(atobData);
      if(_finalData.role == 'lekarz') {
        return true;
      }
    }
    window.alert('Zaloguj się aby edytować swoje dane i zarządzać terminami');
    return false;
  }

}

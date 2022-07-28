import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  registerUser(daneUsera: Object) {
    this.http.post("http://localhost:3001/user/register", daneUsera).subscribe(response => {
      console.log(response);
      //TODO: jakos trzeba poinformować użytkownika że podany login juz istnieje
    });
  }
}

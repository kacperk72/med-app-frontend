import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient,) { }

  getDoctorsData() {
    return this.http.get("http://localhost:3001/doctor");
  }

  addDoctor(doctorData: any) {
    return this.http.post("http://localhost:3001/doctor/register", doctorData)
  }

  deleteDoctor(doctorId: string) {
    return this.http.delete(`http://localhost:3001/doctor/delete/${doctorId}`)
  }
}

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css']
})
export class EditDoctorComponent implements OnInit {

  isVisibleEdit = true;


  constructor() { }

  ngOnInit(): void {
  }

  editTerm() {
    if(this.isVisibleEdit == true){
      this.isVisibleEdit = false;
    } else {
      this.isVisibleEdit = true;
    }
  }

}

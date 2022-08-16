import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookedTermElement, BookedTermElementFull } from '../models/term-types';
import { EditDoctorService } from '../service/edit-doctor.service';

@Component({
  selector: 'app-booked-terms',
  templateUrl: './booked-terms.component.html',
  styleUrls: ['./booked-terms.component.css']
})

export class BookedTermsComponent {

  @Input() set idLek(id: string) {
      this._idLek = id;

      if(!!id.length) {
        this.getBookedTerms();
      }    
  }

  isVisibleEdit = false;
  bookedTermsDataArray: any = [];
  
  private _idLek = '';  
  private subBookedTerms$!: Subscription;
  private subHourFromTerm$!: Subscription;
  private subGetOnePacient$!: Subscription;
  private subGetDate$!: Subscription;

  constructor(private editDoctorService: EditDoctorService) { }

  ngOnDestroy(){
    if(!!this.subBookedTerms$){
      this.subBookedTerms$.unsubscribe();
    }
    if(this.subHourFromTerm$) {
      this.subHourFromTerm$.unsubscribe();
    }
    if(this.subGetOnePacient$) {
      this.subGetOnePacient$.unsubscribe();
    }
    if(this.subGetDate$) {
      this.subGetDate$.unsubscribe();
    }
  }

  editTerm() {
    this.isVisibleEdit != this.isVisibleEdit;
  }

  private getBookedTerms(){
    this.bookedTermsDataArray = [];

    this.subBookedTerms$ = this.editDoctorService.getBookedTerms(this._idLek).subscribe(resp => {
      this.bookedTermsDataArray = resp;
      this.getMoreData();
    })
  }

  private getMoreData() {
    this.bookedTermsDataArray.forEach((el: BookedTermElement) => {
      this.subHourFromTerm$ = this.editDoctorService.getHourFromTerm(el.term_id).subscribe((resp: {godzina_wizyty: string})=> {
        el.godzina_wizyty = resp.godzina_wizyty;        
      })
      this.subGetOnePacient$ = this.editDoctorService.getOnePacient(el.id_pacjenta).subscribe((resp: {name: string, surname: string}) => {
        el.name = resp.name;
        el.surname = resp.surname;   
      })
      this.subGetDate$ = this.editDoctorService.getDateFromTerm(el.id_terminu).subscribe((resp: {data: string}) => {
        el.date = resp.data.split('T')[0];
      })
      // console.log(el);        
    })
  }

  cancelVisit(term: BookedTermElementFull) {
    // console.log(term);
    
    this.editDoctorService.cancelVisit(term.id_wizyty).subscribe( resp => {
      console.log("Usunięto wizytę", term.id_wizyty);
    })
    window.location.reload();
  }
}



import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EditDoctorService } from '../service/edit-doctor.service';

@Component({
  selector: 'app-booked-terms',
  templateUrl: './booked-terms.component.html',
  styleUrls: ['./booked-terms.component.css']
})
export class BookedTermsComponent implements OnInit {
  subscription1$!: Subscription;
  subscription2$!: Subscription;
  subscription3$!: Subscription;
  subscription4$!: Subscription;

  @Input() set idLek(id: string) {
      this._idLek = id;
      this.getBookedTerms();
  }

  private _idLek = '';
  bookedTermsDataArray: any;
  isVisibleEdit = false;

  constructor(private editDoctorService: EditDoctorService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscription1$.unsubscribe();
    this.subscription2$.unsubscribe();
    this.subscription3$.unsubscribe();
    this.subscription4$.unsubscribe();
  }

  editTerm() {
    this.isVisibleEdit != this.isVisibleEdit;
  }

   getBookedTerms(){
    this.subscription1$ = this.editDoctorService.getBookedTerms(this._idLek).subscribe(resp => {
      this.bookedTermsDataArray = resp;
      this.bookedTermsDataArray.forEach((el: {
        date: any;
        surname: any;
        name: any;
        godzina: Object; 
        term_id: string; id_pacjenta: string; id_terminu: string;}) => {
        this.subscription2$ = this.editDoctorService.getHourFromTerm(el.term_id).subscribe((resp: {godzina_wizyty: string})=> {
          el.godzina = resp.godzina_wizyty;        
        })
        this.subscription3$ = this.editDoctorService.getOnePacient(el.id_pacjenta).subscribe((resp: {name: string, surname: string}) => {
          el.name = resp.name;
          el.surname = resp.surname;   
        })
        this.subscription4$ = this.editDoctorService.getDateFromTerm(el.id_terminu).subscribe((resp: {data: string}) => {
          el.date = resp.data.split('T')[0];
        })

        // console.log(el);        
      })
    })
  }
}



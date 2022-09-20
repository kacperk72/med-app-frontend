import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchForm } from '../models/doctor-types';
import { AuthService } from '../service/auth.service';
import { TermListService } from '../service/term-list.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { DoctorTERM } from '../patient/patient.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-term-list',
    templateUrl: './term-list.component.html',
    styleUrls: ['./term-list.component.css'],
})
export class TermListComponent implements OnInit {
    // @ViewChild(MatPaginator) paginator!: MatPaginator;

    @Input() renderTable!: boolean;
    @Input() renderVisits!: boolean;
    @Input() loadDataSpinner!: boolean;
    @Input() loadDataSpinner2!: boolean;
    @Input() search!: SearchForm;
    @Input() visitTime!: number;
    @Input() termsArray!: DoctorTERM[];
    @Input() termDataArray!: MatTableDataSource<DoctorTERM>;

    @Output() newItemEvent = new EventEmitter<number>();
    // @Output() onChange:

    //kolumny w tabeli terminów
    displayedData: string[] = ['photo', 'imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
    dataSource: any;

    // zmienne do załadowania danych do komponentów
    isVisible = true;

    termDataBooking: any = {};

    value = 1;

    constructor(private termListService: TermListService, private authService: AuthService, private editDoctorService: EditDoctorService) {}

    ngOnInit(): void {}

    loadMore() {
        this.value++;
        this.newItemEvent.emit(this.value);
    }

    confirmTerm(element: DoctorTERM): void {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
        this.termDataBooking = element;
    }

    closeBooking(): void {
        this.isVisible = true;
    }

    bookTerm(): void {
        let textAreaValue;
        const token = this.authService.GetToken();
        const tokenJson = this.authService.GetRolebyToken(token);
        const login = tokenJson.login;
        if (document.querySelector('#textArea')) {
            textAreaValue = document.querySelector<HTMLInputElement>('#textArea')?.value;
        }
        this.termDataBooking.reason = textAreaValue || '';
        this.termDataBooking.login = login;
        console.log(this.termDataBooking);

        //na sztywno ustawione na backendzie długosc 15 min
        this.termListService.bookTerm(this.termDataBooking).subscribe(() => {
            console.log('dodano wizyte');
        });
        this.closeBooking();
        window.location.reload();
        window.alert('Rezerwacja zakończona sukcesem!');
    }
}

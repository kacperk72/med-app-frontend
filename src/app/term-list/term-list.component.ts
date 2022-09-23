import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchForm } from '../models/doctor-types';
import { AuthService } from '../service/auth.service';
import { TermListService } from '../service/term-list.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { DoctorTERM } from '../patient/patient.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

// interface DoctorTERMExtended extends DoctorTERM {
//     reason?: string;
//     login?: string;
// }

@Component({
    selector: 'app-term-list',
    templateUrl: './term-list.component.html',
    styleUrls: ['./term-list.component.css'],
})
export class TermListComponent {
    // @ViewChild(MatPaginator) paginator!: MatPaginator;

    @Input() loadDataSpinner!: boolean;
    @Input() visitTime!: number;
    @Input() set termsArray(data: DoctorTERM[]) {
        this.termDataArray = new MatTableDataSource(data);
    }

    @Output() newItemEvent = new EventEmitter<number>();

    termDataArray: MatTableDataSource<DoctorTERM> = new MatTableDataSource();

    // @Output() onChange:

    //kolumny w tabeli terminów
    displayedData: string[] = ['photo', 'imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
    // dataSource: any;

    // zmienne do załadowania danych do komponentów
    isVisible = true;
    reason = '';

    termDataBooking!: any;
    data = '';
    godzina = '';

    private _value = 1;

    constructor(private termListService: TermListService, private authService: AuthService, private route: Router) {}

    loadMore(): void {
        this._value++;
        this.newItemEvent.emit(this._value);
    }

    confirmTerm(element: DoctorTERM): void {
        this.termDataBooking = element;
        this.data = element.data.split('T')[0];
        this.godzina = element.godzina;
        this.isVisible = !this.isVisible;
    }

    closeBooking(): void {
        this.isVisible = true;
    }

    bookTerm(): void {
        const token = this.authService.GetToken();
        const tokenJson = this.authService.GetRolebyToken(token);
        const login = tokenJson.login;
        this.termDataBooking.reason = this.reason;
        this.termDataBooking.login = login;

        //na sztywno ustawione na backendzie długosc 15 min
        this.termListService.bookTerm(this.termDataBooking).subscribe(() => {
            console.log('dodano wizyte');
        });
        this.closeBooking();
        window.alert('Rezerwacja zakończona sukcesem!');
        this.route.navigate(['/mojeWizyty']);
    }

    getBackgroundColor() {
        if (this.loadDataSpinner) {
            return 0.3;
        } else {
            return 1;
        }
    }
}

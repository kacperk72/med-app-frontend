import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PacientBookTermElement } from '../models/pacient-types';
import { TermElement } from '../models/term-types';
import { AuthService } from '../service/auth.service';
import { TermListService } from '../service/term-list.service';

@Component({
    selector: 'app-term-list',
    templateUrl: './term-list.component.html',
    styleUrls: ['./term-list.component.css'],
})
export class TermListComponent implements OnInit {
    // @ViewChild(MatPaginator) paginator!: MatPaginator;

    @Input() termListArray: TermElement[] = [];
    @Input() termDataArray!: MatTableDataSource<TermElement>;
    @Input() renderTable!: boolean;
    @Input() loadDataSpinner!: boolean;

    // @Output() onChange:

    //kolumny w tabeli terminów
    displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
    dataSource: any;

    //zmienne do rezerwacji wizyty
    termDataBooking!: PacientBookTermElement;

    // zmienne do załadowania danych do komponentów
    isVisible = true;
    isLoadedData = false;

    constructor(private termListService: TermListService, private authService: AuthService) {}

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.termListArray);
        // this.dataSource.paginator = this.paginator;
    }

    confirmTerm(element: PacientBookTermElement): void {
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

    // rezerwacja wizyty
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
        // console.log(this.termDataBooking);

        // dodawanie wpisu
        this.termListService.bookTerm(this.termDataBooking).subscribe(() => {
            console.log('dodano wizyte');
        });
        this.closeBooking();
        window.location.reload();
        window.alert('Rezerwacja zakończona sukcesem!');
    }
}

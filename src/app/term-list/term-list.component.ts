import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScheduleDataElement, ScheduleDataTermElement, SearchForm } from '../models/doctor-types';
import { AuthService } from '../service/auth.service';
import { TermListService } from '../service/term-list.service';
import { EditDoctorService } from '../service/edit-doctor.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-term-list',
    templateUrl: './term-list.component.html',
    styleUrls: ['./term-list.component.css'],
})
export class TermListComponent implements OnInit {
    // @ViewChild(MatPaginator) paginator!: MatPaginator;

    @Input() scheduleDataArray!: ScheduleDataElement[];
    @Input() renderTable!: boolean;
    @Input() renderVisits!: boolean;
    @Input() loadDataSpinner!: boolean;
    @Input() loadDataSpinner2!: boolean;
    @Input() search!: SearchForm;

    // @Output() onChange:

    @Output() paginator: EventEmitter<number> = new EventEmitter();
    @Output() calculate: EventEmitter<void> = new EventEmitter();

    //kolumny w tabeli terminów
    displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
    dataSource: any;

    termDataBooking!: ScheduleDataTermElement;

    // zmienne do załadowania danych do komponentów
    isVisible = true;

    selectedTime = '';
    options = [
        { name: '15 min', value: 15 },
        { name: '30 min', value: 30 },
        { name: '1 h', value: 60 },
    ];

    paginatorCount = 2;

    constructor(private termListService: TermListService, private authService: AuthService, private editDoctorService: EditDoctorService) {}

    ngOnInit(): void {
        // this.dataSource = new MatTableDataSource(this.termListArray);
        // this.dataSource.paginator = this.paginator;
    }

    calculateVisits(event: any): void {
        this.calculate.emit(event.target.value);
    }

    loadMore() {
        this.paginatorCount += 1;
        this.paginator.emit(this.paginatorCount);
    }

    confirmTerm(element: ScheduleDataElement, godzinaWizyty: string, czasTrwaniaW: string): void {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }

        const visit: ScheduleDataTermElement = {
            name: element.name,
            surname: element.surname,
            speciality: element.speciality,
            id_lekarza: element.id_lekarza,
            id_terminu: element.id_terminu,
            city: element.city,
            data: element.data,
            visit_hour: godzinaWizyty,
            reason: '',
            login: '',
            visit_time: czasTrwaniaW,
        };

        this.termDataBooking = visit;
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
        this.termListService.bookTerm(this.termDataBooking).subscribe(() => {
            console.log('dodano wizyte');
        });
        this.closeBooking();
        window.location.reload();
        window.alert('Rezerwacja zakończona sukcesem!');
    }
}

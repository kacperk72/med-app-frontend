import { Component, OnInit, Input } from '@angular/core';
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
    @Input() loadDataSpinner!: boolean;
    @Input() search!: SearchForm;

    // @Output() onChange:

    //kolumny w tabeli terminów
    displayedData: string[] = ['imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];
    dataSource: any;

    termDataBooking!: ScheduleDataTermElement;

    // zmienne do załadowania danych do komponentów
    isVisible = true;
    isLoadedData = false;
    renderVisits = false;
    loadDataSpinner2 = false;

    selectedTime = '';
    options = [
        { name: '15 min', value: 15 },
        { name: '30 min', value: 30 },
        { name: '1 h', value: 60 },
    ];

    visits: any = [];
    visit: any;
    done = true;

    constructor(private termListService: TermListService, private authService: AuthService, private editDoctorService: EditDoctorService) {}

    ngOnInit(): void {
        // this.dataSource = new MatTableDataSource(this.termListArray);
        // this.dataSource.paginator = this.paginator;
    }

    calculateVisits(event: any): void {
        console.log('searchForm', this.search);

        console.log('scheduleDataArray', this.scheduleDataArray);
        const visitTime = event.target.value;
        this.scheduleDataArray.forEach((el) => {
            el.visits = [];
        });
        this.scheduleDataArray.forEach((elem) => {
            this.editDoctorService
                .getHourSchedule(elem.id_terminu, elem.id_lekarza, visitTime)
                .pipe(
                    map((el) => {
                        el.map((element: any) => {
                            this.visits.push(element);
                            this.scheduleDataArray.forEach((term) => {
                                if (term.id_lekarza === element.id_lekarza && term.id_terminu === element.id_terminu && term.data === element.data) {
                                    term.visits.push(element.godzina);
                                }
                            });
                        });
                    })
                )
                .subscribe(() => {});
        });
        this.loadDataSpinner2 = true;
        this.renderVisits = false;
        setTimeout(() => {
            this.loadDataSpinner2 = false;
            this.renderVisits = true;
        }, 2000);
        // console.log('visits', this.visits);
        // console.log('scheduleDataArray', this.scheduleDataArray);
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

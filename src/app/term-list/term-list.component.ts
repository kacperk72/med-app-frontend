import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { TermListService } from '../service/term-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorTERM } from '../models/doctor-types';

@Component({
    selector: 'app-term-list',
    templateUrl: './term-list.component.html',
    styleUrls: ['./term-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    displayedData: string[] = ['photo', 'imie', 'nazwisko', 'specjalnosc', 'miasto', 'termin', 'icons'];

    isVisible = true;
    reason = '';
    termDataBooking!: DoctorTERM;
    data = '';
    godzina = '';

    private _value = 1;

    constructor(private termListService: TermListService, private authService: AuthService, private route: Router) {}

    // @HostListener('window:scroll', ['$event']) getScrollHeight(): void {
    //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    //         console.log('bottom of the page');
    //     }
    // }

    @HostListener('scroll', ['$event']) onScroll(event: any): void {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
            if (this._value < 4) {
                this.loadMore();
            }
        }
    }

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

    getBackgroundColor(): number {
        if (this.loadDataSpinner) {
            return 0.3;
        } else {
            return 1;
        }
    }
}

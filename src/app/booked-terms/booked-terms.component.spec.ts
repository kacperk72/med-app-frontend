import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BookedTermsComponent } from './booked-terms.component';

describe('BookedTermsComponent', () => {
    let component: BookedTermsComponent;
    let fixture: ComponentFixture<BookedTermsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookedTermsComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookedTermsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

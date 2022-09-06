import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { TermListComponent } from './term-list.component';

describe('TermListComponent', () => {
    let component: TermListComponent;
    let fixture: ComponentFixture<TermListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TermListComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                FormBuilder
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TermListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

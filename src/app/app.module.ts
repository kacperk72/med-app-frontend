import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AdminComponent } from './admin/admin.component';
import { MatTableModule } from '@angular/material/table';
import { PatientComponent } from './patient/patient.component';
import { TermListComponent } from './term-list/term-list.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import {MatListModule} from '@angular/material/list';
import { MedicalAppointmentComponent } from './medical-appointment/medical-appointment.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    PatientComponent,
    TermListComponent,
    EditDoctorComponent,
    MedicalAppointmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

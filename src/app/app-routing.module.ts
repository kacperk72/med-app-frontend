import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { LoginComponent } from './login/login.component';
import { MedicalAppointmentComponent } from './medical-appointment/medical-appointment.component';
import { PatientComponent } from './patient/patient.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/pacjent', pathMatch: 'full'},
  { path: 'zaloguj', component:  LoginComponent},
  { path: 'zarejestruj', component:  RegisterComponent},
  { path: 'admin', component:  AdminComponent},
  { path: 'pacjent', component:  PatientComponent},
  { path: 'edytujDoktora', component:  EditDoctorComponent},
  { path: 'mojeWizyty', component: MedicalAppointmentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

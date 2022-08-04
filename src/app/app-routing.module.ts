import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { LoginComponent } from './login/login.component';
import { MedicalAppointmentComponent } from './medical-appointment/medical-appointment.component';
import { PatientComponent } from './patient/patient.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './shared/auth.guard';
import { AdminRoleGuard } from './shared/admin-role.guard';
import { PacientRoleGuard } from './shared/pacient-role.guard';
import { DoctorRoleGuard } from './shared/doctor-role.guard';
import { AdminEditDoctorComponent } from './admin-edit-doctor/admin-edit-doctor.component';

const routes: Routes = [
  { path: '', redirectTo: '/pacjent', pathMatch: 'full'},
  { path: 'zaloguj', component:  LoginComponent},
  { path: 'zarejestruj', component:  RegisterComponent},
  { path: 'admin', component:  AdminComponent, canActivate:[AdminRoleGuard]},
  { path: 'pacjent', component:  PatientComponent, canActivate:[AuthGuard]},
  { path: 'edytujDoktora', component:  EditDoctorComponent, canActivate:[DoctorRoleGuard]},
  { path: 'mojeWizyty', component: MedicalAppointmentComponent, canActivate:[PacientRoleGuard]},
  { path: 'adminEditDoctor/:id_lek/:spec/:city/:login/:name/:surname', component: AdminEditDoctorComponent, canActivate:[AdminRoleGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

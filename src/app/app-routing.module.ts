import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { PacjentComponent } from './pacjent/pacjent.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/pacjent', pathMatch: 'full'},
  { path: 'zaloguj', component:  LoginComponent},
  { path: 'zarejestruj', component:  RegisterComponent},
  { path: 'admin', component:  AdminComponent},
  { path: 'pacjent', component:  PacjentComponent},
  // { path: 'szukajWizyte', component:  Interview},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

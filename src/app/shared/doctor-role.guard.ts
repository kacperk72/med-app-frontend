import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DoctorRoleGuard implements CanActivate {

    constructor(private service: AuthService, private route: Router) {

    }

    canActivate(): boolean{
        if(this.service.HaveAccessDoctor())
        {return true;}
        else {
            this.route.navigate(['/zaloguj']);
            return false;
        }
    }

}

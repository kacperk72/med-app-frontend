import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private inject: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authservice = this.inject.get(AuthService);
        const jwtToken = req.clone({
            setHeaders:{
                Authorization: 'bearer '+authservice.GetToken()
            }
        });
        return next.handle(jwtToken);
    }
}

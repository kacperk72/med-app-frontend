import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  subscription1$!: Subscription;

  title = 'med-app';
  role = '';
  showMenu: boolean = false;
  showIcon: boolean = true;

  constructor(public service: AuthService,  private router: Router){ }

  ngOnInit(): void {
    // this.role = localStorage.getItem('rola')||'';
    this.subscription1$ = this.router.events.subscribe((val) => { this.role = localStorage.getItem('rola')||'';})
  }

  ngOnDestroy(){
    this.subscription1$.unsubscribe();
  }

  switchMenu(){
    this.showMenu =!this.showMenu

  }


}

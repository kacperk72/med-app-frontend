import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'med-app';
  role = '';
  showMenu: boolean = false;
  showIcon: boolean = true;

  private subEvent$!: Subscription;

  constructor(public service: AuthService,  private router: Router){ }

  ngOnInit(): void {
    // this.role = localStorage.getItem('rola')||'';
    this.subEvent$ = this.router.events.subscribe((val) => {this.role = localStorage.getItem('rola')||'';})
  }

  ngOnDestroy(){
    if(this.subEvent$){
      this.subEvent$.unsubscribe();
    }
  }

  switchMenu(){
    this.showMenu =! this.showMenu;
  }

}

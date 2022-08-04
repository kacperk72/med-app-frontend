import { Component, OnInit } from '@angular/core';
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

  constructor(public service: AuthService){ 
    
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('rola')||'';
  }

  switchMenu(){
    if(this.showMenu == false){
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }


}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public curentUser: string;

  constructor(private router: Router) { }

  ngOnInit() {
    // set curent user name
    this.curentUser = localStorage.getItem('currentUser').replace(/"/g, '');
  }


  // ! Log-out event
  LogOutEvent() {
    localStorage.clear(); // clear user from local storage
    this.router.navigate(['/login']); // redirect user to login screen
  }

}

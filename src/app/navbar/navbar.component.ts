import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navbarOpen = false;
  constructor(private userService: UserService) { }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  readLocalStorageValue() {
    return localStorage.getItem("auth_token");
  }

  logoff() {
    this.userService.logout();
  }
}
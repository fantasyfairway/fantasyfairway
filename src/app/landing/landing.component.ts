import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  redirect(id) {
    if (localStorage.getItem('auth_token') == null) {
      localStorage.setItem('redirect', id)
      this.router.navigate(['/login']);
    }
    else {
      this.router.navigate([id]);
    }
  }

  readLocalStorageValue() {
    if (localStorage.getItem('auth_token') == undefined) {
      return true;
    }
    else {
      return false;
    }
  }
}
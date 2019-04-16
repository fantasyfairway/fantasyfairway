import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';
import { Credentials } from '../shared/models/credentials.interface';
import { UserService } from '../shared/services/user.service';

import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  brandNew: boolean;
  errors: string;
  isRequesting: boolean;
  submitted: boolean = false;
  credentials: Credentials = { username: '', password: '' };

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.brandNew = param['brandNew'];
        this.credentials.username = param['username'];
      });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  login({ value, valid }: { value: Credentials, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.userService.login(value.username, value.password)
        .pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
              if (localStorage.getItem('redirect') != null) {
                this.router.navigate([localStorage.getItem('redirect')]);
                localStorage.removeItem('redirect');
              }
              else {
                this.router.navigate(['/landing']);
              }
            }
          },
          error => this.errors = error);
    }
  }
}
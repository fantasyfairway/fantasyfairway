import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }
    //Users must be logged in to access stuff using this code, if there is an auth_token in the local browser they are good, if not they get redirected to landing.
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('auth_token')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/landing'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
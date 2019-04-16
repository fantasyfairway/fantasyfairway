import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AdminGuard implements CanActivate {


    getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
      }

    constructor(private router: Router) { }
    //Users must be logged in to access stuff using this code, if there is an auth_token in the local browser they are good, if not they get redirected to landing.
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let token = localStorage.getItem('auth_token');
        let tokeninfo = this.getDecodedAccessToken(token);
        let role = tokeninfo.rol;

        if (role == "admin") {
            // admin so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/landing'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
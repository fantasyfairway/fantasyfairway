import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { ProfileDetails } from '../models/profile.details.interface';
import { ConfigService } from '../../shared/utils/config.service';

import { BaseService } from '../../shared/services/base.service';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

//import * as _ from 'lodash';

@Injectable()

export class ProfileService extends BaseService {

    baseUrl: string = '';

    constructor(private http: Http, private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
    }

    getProfileDetails(): Observable<ProfileDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/profile/get", { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }

    updateProfile(firstName, lastName, username ) {
        let body = JSON.stringify({ firstName, lastName, username });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.baseUrl + "/profile/update", body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }
}
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


import { ProfileDetails } from '../models/profile.details.interface';
import { LeagueName } from '../models/league.name.interface';
import { ConfigService } from '../../shared/utils/config.service';

import { BaseService } from '../../shared/services/base.service';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { LeagueDetails } from '../models/league.details';
import { LeagueUserDetails } from '../models/leagueuser.details';


//import * as _ from 'lodash';

@Injectable()

export class LeagueService extends BaseService {

    baseUrl: string = '';

    constructor(private http: Http, private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
    }


    getLeagues(): Observable<LeagueDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/leagues", { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }

    getLeague(leagueId): Observable<LeagueDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/leagues" + leagueId, { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }

    updateLeague(leagueId, leagueName, active, picture) {
        let body = JSON.stringify({leagueId, leagueName, active, picture });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.baseUrl + "/leagues/" + leagueId, body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    createLeague(leagueName, active, picture){
        let body = JSON.stringify({ leagueName, active, picture });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseUrl + "/leagues", body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    deleteLeague(leagueId){
        let authToken = localStorage.getItem('auth_token');
        let headers = new Headers({'Authorization': `Bearer ${authToken}`});
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(this.baseUrl + "/leagues/" + leagueId , options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    addUserToLeague(leagueId, teamname){
        let body = JSON.stringify({ leagueId, teamname });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseUrl + "/userleagues", body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    deleteUserFromLeague(leagueId){
        let authToken = localStorage.getItem('auth_token');
        let headers = new Headers({'Authorization': `Bearer ${authToken}`});
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(this.baseUrl + "/userleagues/" + leagueId , options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    getUserLeagues(): Observable<LeagueUserDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/userleagues", { headers })

            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }
}
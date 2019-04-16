import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { ProfileDetails } from '../models/profile.details.interface';
import { ConfigService } from '../../shared/utils/config.service';

import { BaseService } from '../../shared/services/base.service';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { LeagueDetails } from '../models/league.details';
import { LeagueUserDetails } from '../models/leagueuser.details';

//import * as _ from 'lodash';

@Injectable()

export class TeamService extends BaseService {

    baseUrl: string = '';

    constructor(private http: Http, private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
    }

    getTeams(): Observable<LeagueDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/teams", { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }

    getDashboard(): Observable<LeagueDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/dashboard", { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }

    getTourneyDashboard(): Observable<LeagueDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http.get(this.baseUrl + "/tournaments", { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }

    updateTeam(teamID) {
        let body = JSON.stringify({teamID});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.baseUrl + "/teams" + teamID, body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    createPlayerTeam(teamID, playerNames, tournamentName){
        let body = JSON.stringify({ teamID, playerNames, tournamentName });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseUrl + "/playerteams", body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

}
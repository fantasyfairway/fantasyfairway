import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { PlayerDetails } from '../models/player.details';
import { ConfigService } from '../../shared/utils/config.service';

import { BaseService } from '../../shared/services/base.service';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { LeagueDetails } from '../models/league.details';
import { LeagueUserDetails } from '../models/leagueuser.details';

//import * as _ from 'lodash';

@Injectable()

export class TournamentService extends BaseService {

    baseUrl: string = '';

    constructor(private http: Http, private configService: ConfigService) {
        super();
        this.baseUrl = configService.getApiURI();
    }


    createTournament(TournamentName, TournamentDates) {
        let body = JSON.stringify({ TournamentName, TournamentDates });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseUrl + "/tournaments", body, options)
            .pipe(map(response => response.json))
            .pipe(catchError(this.handleError))
    }

    getPlayers(): Observable<PlayerDetails> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);
    
        return this.http.get(this.baseUrl + "/appusers", { headers })
            .pipe(map(response => response.json()))
            .pipe(catchError(this.handleError));
    }
}
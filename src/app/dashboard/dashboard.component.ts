import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { League } from '../league/league';
import { Team } from './team';
import { TeamService } from '../shared/services/team.service';
import { LeagueService } from '../shared/services/league.service';
import { LeagueUserDetails } from "../shared/models/leagueuser.details"
import { Player } from '../player/player';
import { PlayerService } from '../shared/services/player.service';
import { TournamentService } from '../shared/services/tournament.service';
import { finalize } from 'rxjs/operators';

@Component
    ({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    })
export class DashboardComponent implements OnInit {

    x: number = 0;
    i: number = 0;

    data: any;
    leaderboard: any;
    tour: any;
    tournament: any;
    players: Player[] = [];
    filteredPlayers: Player[] = [];
    isRequesting: any;
    errors: any;
    //league: Team[] = [];
    teams: Team[] = [];
    t = new Team;
    expandedTeam: Player[] = null;
    leagues: any;
    tournaments: any;




    constructor(private http: HttpClient, private teamService: TeamService, private playerService: PlayerService, private tournamentService: TournamentService) { }


    ngOnInit() {


        //this.getPlayersBE();
        this.getPlayersGO();
        this.teams.push(this.t);
        this.teams.push(this.t);
        this.teams.push(this.t);

        this.teamService.getDashboard().subscribe(response => {
            this.leagues = response;
            this.leagues.forEach(element => {
                let table = document.createElement('table');
                table.border = '2';
                table.width = '100%';

                //the header
                let head = document.createElement('thead');
                let headRow = document.createElement('tr');
                let header = document.createElement('th');
                header.colSpan = 4;
                let h3 = document.createElement('h3');
                h3.style.textAlign = "center";
                h3.innerHTML = element.leagueName + " Leaderboard";

                header.appendChild(h3);
                headRow.appendChild(header);
                head.appendChild(headRow);

                let desRow = document.createElement('tr');
                let teamName = document.createElement('th');
                teamName.innerHTML = "Team Name";
                let userName = document.createElement('th');
                userName.innerHTML = "Owner";
                let playersChosen = document.createElement('th');
                playersChosen.innerHTML = "Players";
                let teamScore = document.createElement('th');
                teamScore.innerHTML = "Team Score";

                desRow.appendChild(teamName);
                desRow.appendChild(userName);
                desRow.appendChild(playersChosen);
                desRow.appendChild(teamScore);
                head.appendChild(desRow);

                //the body
                let body = document.createElement('tbody');
                let teams = element.teams;

                teams.forEach(T => {
                    let bodyRow = document.createElement('tr');

                    let teamName = document.createElement('td');
                    teamName.innerHTML = T.teamName;
                    let userName = document.createElement('td');
                    userName.innerHTML = T.userName;

                    let playersChosen = document.createElement('td')
                    let players = T.players;
                    let playersChosenString: string = "";

                    players.forEach(P => {
                        playersChosenString = P.playerName + " (" +
                            P.roundOne + ", "
                            + P.roundTwo + ", "
                            + P.roundThree + ", "
                            + P.roundFour + ")";

                        playersChosen.innerHTML += playersChosenString + "<br>";
                    });

                    let teamScore = document.createElement('td');
                    teamScore.innerHTML = T.scoreSoFar;

                    bodyRow.appendChild(teamName);
                    bodyRow.appendChild(userName);
                    bodyRow.appendChild(playersChosen);
                    bodyRow.appendChild(teamScore);


                    body.appendChild(bodyRow);
                });
                let br = document.createElement('br');
                table.appendChild(head);
                table.appendChild(body);
                document.getElementById("col2").append(table);
                document.getElementById("col2").append(br);
            });
        })
    }

    //get the players for the live leaderboard
    getPlayersGO() {
        this.http.get('http://204.48.31.158:8000/?format=json').subscribe(response => {
            this.data = response;
            this.leaderboard = this.data.Leaderboards;
            this.tour = this.getTour(this.leaderboard);
            this.tournament = this.tour.Tournament;
            this.players = this.tour.Players;
            this.sortByCupRank();
            this.assignValues();
            this.filteredPlayers = this.players;
            this.filteredPlayers.forEach(element => {
                this.playerService.createPlayer(element.Name,
                    element.Rounds[0], element.Rounds[1], element.Rounds[2], element.Rounds[3],
                    element.ID, element.Value)
                    .pipe(finalize(() => this.isRequesting = false))
                    .subscribe(
                        result => {
                            if (result) {
                            }
                        },
                        errors => this.errors = errors);
            });
            this.sortByTotal();
            this.tournamentService.createTournament(this.tournament, this.tour.Date)
                .pipe(finalize(() => this.isRequesting = false))
                .subscribe(
                    result => {
                        if (result) {
                        }
                    },
                    errors => this.errors = errors);
        });
    }

    //supports the go api call. retrieves pga tour from array of golf leagues
    getTour(leaderboard) {
        for (this.x; this.x < 3; this.x++) {
            if (leaderboard[this.x].Tour == "PGA Tour") {
                return (leaderboard[this.x]);
            }
        }
    }

    sortByCupRank() {
        function compare(a, b) {
            if (a.Rankings.cup_points> b.Rankings.cup_points)
                return -1;
            if (a.Rankings.cup_points < b.Rankings.cup_points)
                return 1;
            return 0;
        }
        this.players.sort(compare);
    }

    sortByTotal() {
        function compare(a, b) {
            if (a.Total < b.Total)
                return -1;
            if (a.Total > b.Total)
                return 1;
            return 0;
        }
        this.players.sort(compare);
    }

    assignValues() {
        var arrayLength = this.players.length;
        for (this.i; this.i < arrayLength; this.i++) {
            this.players[this.i].Selected = false;
            this.players[this.i].ID = this.i;
            if (this.i <= 9) {
                this.players[this.i].Value = 500;
            }
            else if (this.i >= 10 && this.i <= 19) {
                this.players[this.i].Value = 200;
            }
            else if (this.i >= 20 && this.i < arrayLength) {
                this.players[this.i].Value = 100;
            }
        }

    }
}

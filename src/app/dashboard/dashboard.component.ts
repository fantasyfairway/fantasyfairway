import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from '../player/player';
import { League } from '../league/league';
import { Team } from './team';
import { TeamService } from '../shared/services/team.service';
import { LeagueService } from '../shared/services/league.service';
import { LeagueUserDetails } from "../shared/models/leagueuser.details" 

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
    tournament: any;
    players: any;
    userLeagues: LeagueUserDetails;
    //league: Team[] = [];
    teams: Team[] = [];
    t = new Team;
    expandedTeam: Player[] = null;
    leagues: any;
    tournaments: any;




    constructor(private http: HttpClient, private teamService: TeamService) { }


    ngOnInit() {
        //this.getPlayersBE();
        this.getPlayersGO();
        this.teams.push(this.t);
        this.teams.push(this.t);
        this.teams.push(this.t);
      
        this.http.get('https://localhost:5153/api/player').subscribe(response => {
            this.data = response;
        }, error => {
            console.log(error);
        });

        this.teamService.getDashboard().subscribe(response => {
            this.leagues = response;
            console.log(this.leagues);
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
                this.http.get('https://golf.jacoduplessis.co.za/?format=json').subscribe(response => {
                    this.data = response;
                    console.log(this.data);
                    this.leaderboard = this.data.Leaderboards;
                    this.tournament = this.getTournament(this.leaderboard);
                    this.players = this.tournament.Players;
                });
            }

    //supports the go api call. retrieves pga tour from array of golf leagues
    getTournament(leaderboard) {
                for(this.x; this.x < 3; this.x++) {
            if (leaderboard[this.x].Tour == "PGA Tour") {
                return (leaderboard[this.x]);
            }
        }
    }


    expandTeam(Team) {
        Team.expanded = true;
        this.expandedTeam = JSON.parse(JSON.stringify(Team.players));
    }

    collapseTeam(team) {
        team.expanded = false;
        this.expandedTeam = null;
    }
}

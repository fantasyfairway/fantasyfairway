import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { Player } from './player';
import { Team } from '../dashboard/team';
import { ValueTransformer } from '@angular/compiler/src/util';
import { PlayerService } from '../shared/services/player.service';
import { finalize } from 'rxjs/operators';
import { TournamentService } from '../shared/services/tournament.service';
import { League } from '../league/league'
import { TeamService } from '../shared/services/team.service';
import { TeamUpdate } from '../shared/models/team.update.interface';
import { LeagueService } from '../shared/services/league.service'
import { LeagueName } from '../shared/models/league.name.interface'
import { Router } from '@angular/router';
import { PlayerDetails } from '../shared/models/player.details';
import { LeagueUserDetails } from '../shared/models/leagueuser.details';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TeamJoin } from '../shared/models/team.join';
import { validateConfig } from '@angular/router/src/config';
import { UserLeagues } from '../users/userLeagues';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { elementEnd } from '@angular/core/src/render3/instructions';

@Component
    ({
        selector: 'app-player',
        templateUrl: './player.component.html',
        styleUrls: ['./player.component.css']
    })

export class PlayerComponent implements OnInit {
    x: number = 0;
    i: number = 0;
    row: number = 0;

    data: any;
    leaderboard: any;
    tour: any;
    tournament: any;
    players: Player[] = [];
    filteredPlayers: Player[] = [];
    dbPlayers: any;
    team: Player[] = [];
    leagueNames: LeagueName;
    userLeaguesDetail: LeagueUserDetails;
    userLeagues: UserLeagues;
    submitted: any;
    isRequesting: any;
    errors: any;
    router: Router;
    closeResult: string;
    teamJoin: TeamJoin;
    saveButton: boolean;

    teams: any;
    teamPlayers: any;

    private _searchTerm: string;
    get searchTerm(): string {
        return this._searchTerm
    }
    set searchTerm(value: string) {
        this._searchTerm = value;

        this.filteredPlayers = this.filterPlayers(value);
    }

    filterPlayers(searchString: string) {
        return this.players.filter(player => player.Name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
    }

    constructor(private http: HttpClient, private playerService: PlayerService,
        private tournamentService: TournamentService,
        private leagueService: LeagueService,
        private teamService: TeamService,
        private modalService: NgbModal) { }

    ngOnInit() {
        //this.getPlayersBE();
        this.getPlayersGO();

        this.leagueService.getUserLeagues().subscribe((leagueUserDetails: LeagueUserDetails) => {
            this.userLeaguesDetail = leagueUserDetails;

        });

        this.teamService.getTeams().subscribe(response => {
            this.teams = response;

            this.teams.forEach(element => {
                //the table
                let table = document.createElement('table');
                table.border = '5';
                table.width = '90%';
                table.cellPadding = '5';
                table.cellSpacing = '3';
                //the header
                let head = document.createElement('thead');
                let headRow = document.createElement('tr');
                let header = document.createElement('th');
                header.colSpan = 3;
                let h3 = document.createElement('h3');
                h3.innerHTML = element.teamName + ", in the league " + element.leagueName + ".";

                header.appendChild(h3);
                headRow.appendChild(header);
                head.appendChild(headRow);

                let desRow = document.createElement('tr');
                let playerName = document.createElement('th');
                playerName.innerHTML = "Player Name";
                let playerRank = document.createElement('th');
                playerRank.innerHTML = "Player Rank";
                let value = document.createElement('th');
                value.innerHTML = "Player Value";

                desRow.appendChild(playerName);
                desRow.appendChild(playerRank);
                desRow.appendChild(value);
                head.appendChild(desRow);

                //the body
                let body = document.createElement('tbody');
                let players = element.players;

                players.forEach(element => {
                    let bodyRow = document.createElement('tr');
                    let playerName = document.createElement('td');
                    playerName.innerHTML = element.playerName;
                    let playerRank = document.createElement('td');
                    playerRank.innerHTML = element.rank;
                    let value = document.createElement('td');
                    value.innerHTML = element.value;
                    bodyRow.appendChild(playerName);
                    bodyRow.appendChild(playerRank);
                    bodyRow.appendChild(value);
                    body.appendChild(bodyRow);
                });

                table.appendChild(head);
                table.appendChild(body);
                let br = document.createElement('br');
                document.getElementById("col1").append(table);
                document.getElementById("col1").append(br);
            });

        });



        //this.teamService.getPlayerTeam().subscribe
        // this.leagueService.getLeagues().subscribe((response) => {
        //         this.leagueNames = response;  },
        //     error => { 
        //         //this.notificationService.printErrorMessage(error);
        //     }); 
        /*var TestCtrl = function ($scope, $http) 
        {  
  
            $scope.SendData = function () 
            {  
                var GetAll = this.players;  
                GetAll.firstName = "John";  
                GetAll.lastName = "Sisson";  
                GetAll.score = "-4"; 
      
                $http({  
                    url: "http://68.183.61.49:8000/api/player",  
                    dataType: 'json',  
                    method: 'POST',  
                    data: GetAll,  
                    headers: {  
                        "Content-Type": "application/json"  
                    }  
                 }).success(function (response) {  
                    $scope.value = response;  
                 })  
                   .error(function (error) {  
                      alert(error);  
                   });  
            }  
        }; */
    }

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

    sortByCupRank() {
        function compare(a, b) {
            if (a.Rankings.cup_points > b.Rankings.cup_points)
                return -1;
            if (a.Rankings.cup_points < b.Rankings.cup_points)
                return 1;
            return 0;
        }
        this.players.sort(compare);
    }


    getTour(leaderboard) {
        for (this.x; this.x < 3; this.x++) {
            if (leaderboard[this.x].Tour == "PGA Tour") {
                return (leaderboard[this.x]);
            }
        }
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

    selectPlayer(player, id) {
        if (this.validateTeam(player, this.team) == true) {
            player.Selected = !player.Selected;
            this.team.push(player);
        }
        this.validate(this.team);
    }

    removePlayer(player, id) {
        player.Selected = !player.Selected;
        const index = this.team.indexOf(player);
        for (let o = 0; o < this.team.length; o++) {
            if (this.team[o] == player) { this.team.splice(index, 1) };
        };
    }

    validateTeam(player, team) {
        if (this.addPlayers(team) + player.Value <= 1000) {
            return true;
        }
        else {
            return false;
        }
    }


    validate(players) {
        let v: number = 0;
        players.forEach(player => {
            v += player.Value;
        });
        var d = new Date();
        var day = d.toDateString();
        if (v == 1000 
            && (day.slice(0, 3) == "Mon" || day.slice(0, 3) == "Tue" || day.slice(0, 3) == "Wed") == true) { this.saveButton = true; }
        else { this.saveButton = false; }
    }

    addPlayers(team) {
        let value: Number = 0;
        for (let player of team) {
            value += player.Value;
        }
        return value;
    }

    calculateScore(rounds: number[]) {
        let score = 0;
        rounds.forEach(Round => {
            score += Round;
        });
        return score;
    }


    parseTeam(data) {
        //TO DO Parse Teams from Back End
        return this.team;
    }

    saveTeam({ value, valid }: { value: TeamJoin, valid: boolean }) {
        this.submitted = true;
        this.isRequesting = true;
        this.errors = '';
        let names: string[] = [];
        this.team.forEach(element => {
            names.push(element.Name);
        });
        this.http.get('https://golf.jacoduplessis.co.za/?format=json').subscribe(response => {
            this.data = response;
            this.leaderboard = this.data.Leaderboards;
            this.tour = this.getTour(this.leaderboard);
            this.tournament = this.tour.Tournament;
            if (valid) {
                this.teamService.createPlayerTeam(value.teamid, names, this.tournament)
                    .pipe(finalize(() => this.isRequesting = false))
                    .subscribe(
                        result => {
                            if (result) {
                                setTimeout(function () { window.location.reload(); }, 10);
                            }
                        },
                        errors => this.errors = errors);
            }
        });
    }


    sortPlayersByID(unsortedPlayers) {
        this.filteredPlayers = unsortedPlayers.sort((PlayerA: Player, PlayerB: Player) => {
            return PlayerA.ID - PlayerB.ID;
        });
    }

    sortPlayersByName(unsortedPlayers) {
        this.filteredPlayers = unsortedPlayers.sort((PlayerA: Player, PlayerB: Player) => {
            return PlayerA.Name.localeCompare(PlayerB.Name);
        });
    }

    sortPlayersByCountry(unsortedPlayers) {
        this.filteredPlayers = unsortedPlayers.sort((PlayerA: Player, PlayerB: Player) => {
            return PlayerA.Country.localeCompare(PlayerB.Country);
        });
    }

    open(content) {

        this.teamService.getTeams().subscribe(response => {
            this.teams = response;

            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });

        });

    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}

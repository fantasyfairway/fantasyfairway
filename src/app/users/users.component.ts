import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { Player } from '../player/player';
import { LeagueName } from '../shared/models/league.name.interface';
import { Router } from '@angular/router';
import { LeagueService } from '../shared/services/league.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserDetails } from '../shared/models/user.details';
import { LeagueDetails } from '../shared/models/league.details';
import { UserService } from '../shared/services/user.service';
import { LeagueUserDetails } from '../shared/models/leagueuser.details';
import { finalize } from 'rxjs/operators';
import { TeamService } from '../shared/services/team.service';
import { TournamentService } from '../shared/services/tournament.service';
import { PlayerService } from '../shared/services/player.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']


})

export class UsersComponent implements OnInit {

  x: number = 0;
  i: number = 0;

  data: any;
  leaderboard: any;
  tour: any;
  tournament: any;
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  leagueNames: LeagueName;
  team: Player[] = [];
  submitted: any;
  isRequesting: any;
  errors: any;
  router: Router;
  users: any;
  leagues: any;
  filteredUsers: UserDetails[] = [];
  filteredLeagues: LeagueDetails[] = [];
  leagueDetails: LeagueDetails = { id: 0, leagueName: ' ', active: false, picture: '' };
  leagueUserDetails: LeagueUserDetails;
  usersInLeagues: any;
  dashboard: any;
  userDetails: UserDetails;
  success: boolean = false;
  closeResult: string;


  //sendResultsForm: FormGroup;
  
  sendOtherMessageForm: FormGroup;
  sendSignUpReminderForm: FormGroup;
  sendWeeklyReportsForm: FormGroup;
  sendOverallReportsForm: FormGroup;


  disabledSendButton: boolean = true;
  optionsSelect: Array<any>;

  @HostListener('input') oninput() {

    if (this.sendOtherMessageForm.valid) {
      this.disabledSendButton = false;
    }

    if (this.sendSignUpReminderForm.valid) {
      this.disabledSendButton = false;
    }

    if (this.sendWeeklyReportsForm.valid) {
      this.disabledSendButton = false;
    }

    if (this.sendOverallReportsForm.valid) {
      this.disabledSendButton = false;
    }

  }


  private _searchTerm: string;
  get searchTerm(): string {
    return this._searchTerm
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredUsers = this.filterUsers(value);
  }
  private _lSearchTerm: string;
  get lSearchTerm(): string {
    return this._lSearchTerm
  }
  set lSearchTerm(value: string) {
    this._lSearchTerm = value;
    this.filteredLeagues = this.filterLeagues(value);
  }

  filterUsers(searchString: string) {
    return this.users.filter(user => user.username.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  filterLeagues(searchString: string) {
    return this.leagues.filter(league => league.leagueName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  constructor(private leagueService: LeagueService, private modalService: NgbModal, private fb: FormBuilder,
    private connectionService: ConnectionService,
    private userService: UserService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private tournamentService: TournamentService,
    private http: HttpClient, ) {
    this.sendOtherMessageForm = fb.group({

      'sendReportsTournament': ['', Validators.required],
      'sendReportsSubjects': ['', Validators.required],
      'contactFormCopy': [''],
    });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((userDetails: UserDetails) => {
      this.users = userDetails;
      this.filteredUsers = this.users;
    })
    this.leagueService.getLeagues().subscribe((leagueDetails: LeagueDetails) => {
      this.leagues = leagueDetails;
      console.log(this.leagues);
      this.filteredLeagues = this.leagues;
    });
    this.userService.getUsersInLeagues().subscribe(response => {
      this.usersInLeagues = response;
      console.log(this.usersInLeagues);
    })
    this.teamService.getDashboard().subscribe(response => {
      this.dashboard = response;
    })
  }


  sortUsersByID(unsortedUsers) {
    this.filteredUsers = unsortedUsers.sort((UserA: LeagueDetails, UserB: LeagueDetails) => {
      return UserA.id - UserB.id;
    });
  }

  sortUsersByName(unsortedUsers) {
    this.filteredUsers = unsortedUsers.sort((UserA: UserDetails, UserB: UserDetails) => {
      return UserA.firstName.localeCompare(UserB.firstName);
    });
  }

  sortUsersByUsername(unsortedUsers) {
    this.filteredUsers = unsortedUsers.sort((UserA: UserDetails, UserB: UserDetails) => {
      return UserA.username.localeCompare(UserB.username);
    });
  }

  sortUsersByEmail(unsortedUsers) {
    this.filteredUsers = unsortedUsers.sort((UserA: UserDetails, UserB: UserDetails) => {
      return UserA.email.localeCompare(UserB.email);
    });
  }

  sortUsersByWins(unsortedUsers) {
    this.filteredUsers = unsortedUsers.sort((UserA: User, UserB: User) => {
      return UserA.Wins - UserB.Wins;
    });
  }
  sortLeaguesByID(unsortedLeagues) {
    this.filteredLeagues = unsortedLeagues.sort((LeagueA: LeagueUserDetails, LeagueB: LeagueUserDetails) => {
      return LeagueA.leagueId - LeagueB.leagueId;
    });
  }


  endWeek() {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    this.userService.endWeek()
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe(
        result => {
          if (result) {
            this.success = true;
            setTimeout(function () { window.location.reload(); }, 10);
          }
        },
        errors => this.errors = errors);
  }

  resultsTable() {
    //one email for the new players are in submit lineup by Thursday   "Lineup reminder"
    // one email for weekly score update - what happened in that tournament  "Weekly Score"
    // one for the global score update - your total score to date  "Overall Score"
    // invite a friend thing - LAST nth   "Invite a friend"
  }

  /*onSend() {
    this.connectionService.sendMessage(this.sendResultsForm.value).subscribe(() => {
      alert('Your message has been sent.');
      this.sendResultsForm.reset();
      this.disabledSendButton = true;
    }, error => {
      console.log('Error', error);
    });
  }*/

  onSendWeeklyReport() {
    this.connectionService.sendMessage(this.sendWeeklyReportsForm.value).subscribe(() => {
      alert('Your message has been sent.');
      this.sendWeeklyReportsForm.reset();
      this.disabledSendButton = true;
    }, error => {
      console.log('Error', error);
    });
  }

  onSendOverallReport() {
    this.connectionService.sendMessage(this.sendOverallReportsForm.value).subscribe(() => {
      alert('Your message has been sent.');
      this.sendOverallReportsForm.reset();
      this.disabledSendButton = true;
    }, error => {
      console.log('Error', error);
    });
  }

  onSendSignUpReminder() {
    this.connectionService.sendMessage(this.sendSignUpReminderForm.value).subscribe(() => {
      alert('Your message has been sent.');
      this.sendSignUpReminderForm.reset();
      this.disabledSendButton = true;
    }, error => {
      console.log('Error', error);
    });
  }

  onSendOtherMessage() {
    console.log("hello");
    this.connectionService.sendMessage(this.sendOtherMessageForm.value).subscribe(() => {
      alert('Your message has been sent.');
      this.sendOtherMessageForm.reset();
      this.disabledSendButton = true;
    }, error => {
      console.log('Error', error);
    });
  }

  sortLeaguesByName(unsortedLeagues) {
    this.filteredLeagues = unsortedLeagues.sort((LeagueA: LeagueDetails, LeagueB: LeagueDetails) => {
      return LeagueA.leagueName.localeCompare(LeagueB.leagueName);
    });
  }


  updateLeagues({ value, valid }: { value: LeagueDetails, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.leagueService.updateLeague(value.id, value.leagueName, value.active, value.picture)
        .pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
              this.success = true;
              setTimeout(function () { window.location.reload(); }, 10)
            }
          },
          errors => this.errors = errors);
    }

  }

  createLeagues({ value, valid }: { value: LeagueDetails, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.leagueService.createLeague(value.leagueName, value.active, value.picture)
        .pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
              this.success = true;
              setTimeout(function () { window.location.reload(); }, 10)
            }
          },
          errors => this.errors = errors);
    }

  }

  getPlayersGO() {
    this.http.get('http://204.48.31.158:8000/?format=json').subscribe(response => {
      this.data = response;
      console.log(this.data);
      this.leaderboard = this.data.Leaderboards;
      this.tour = this.getTour(this.leaderboard);
      this.tournament = this.tour.Tournament;
      this.players = this.tour.Players;
      console.log(this.players);
      this.sortByCupRank();
      this.assignValues();
      this.filteredPlayers = this.players;
      this.playerService.deletePlayers().pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
            }
          },
          errors => this.errors = errors);
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

  deleteLeagues({ value, valid }: { value: LeagueDetails, valid: boolean }) {
    console.log(value);
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.leagueService.deleteLeague(value.id)
        .pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
              this.success = true;
              setTimeout(function () { window.location.reload(); }, 10)
            }
          },
          errors => this.errors = errors);
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

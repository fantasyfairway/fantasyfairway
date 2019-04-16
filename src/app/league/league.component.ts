import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getTestBed } from '@angular/core/testing';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { Team } from '../dashboard/team'
import { UserLeagues } from '../users/userLeagues';
import { User } from '../users/user';
import { Player } from '../player/player';
import { League } from '../league/league';
import { LeagueDetails } from '../shared/models/league.details';
import { Router } from '@angular/router';
import { LeagueService } from '../shared/services/league.service';
import { finalize } from 'rxjs/operators';
import { LeagueUserDetails } from '../shared/models/leagueuser.details';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { strictEqual } from 'assert';
import { stringify } from 'querystring';

@Component({
    selector: 'app-league',
    templateUrl: './league.component.html',
    styleUrls: ['./league.component.css']
})

export class LeagueComponent implements OnInit {
    leagues: any;
    filteredLeagues: LeagueDetails [] = [];
    leagueDetails: LeagueDetails [] = [];
    userLeagues: LeagueUserDetails;
    adderrors: string;
    errors: string;
    success: boolean = false;
    isRequesting: boolean;
    submitted: boolean = false;
    closeResult: string;

    private _searchTerm: string;
    get searchTerm(): string {
        return this._searchTerm
    }

    set searchTerm(value: string) {
        this._searchTerm = value;
        this.filteredLeagues = this.filterLeagues(value);
    }

    filterLeagues(searchString: string) {
        return this.leagues.filter(league => league.leagueName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
    }

    constructor(private http: HttpClient, private leagueService: LeagueService, private modalService: NgbModal) { }

    ngOnInit() {
        this.leagueService.getLeagues().subscribe((leagueDetails: LeagueDetails) => {
            this.leagues = leagueDetails;
            this.filteredLeagues = this.leagues;
        });
        this.leagueService.getUserLeagues().subscribe((leagueUserDetails: LeagueUserDetails) => {
            this.userLeagues = leagueUserDetails;
        });
    }


    getLeagues() {
        this.leagueService.getLeagues().subscribe((leagueDetails: LeagueDetails) => {
            this.leagues = leagueDetails;
            this.filteredLeagues = this.leagues;
        }, error => {
            console.log(error);
        });
    }

    selectLeague({ value, valid }: { value: LeagueUserDetails, valid: boolean }) {
        this.submitted = true;
        this.isRequesting = true;
        this.errors = '';
        if (valid) {
          this.leagueService.addUserToLeague(value.leagueId, value.teamname)
            .pipe(finalize(() => this.isRequesting = false))
            .subscribe(
              result => {
                if (result) {
                  this.success = true;
                  setTimeout(function(){window.location.reload();},10)
                }
              },
              errors => this.errors = errors);
        }
    
      }

    removeLeague(league) {
        console.log(league);
        this.submitted = true;
        this.isRequesting = true;
        this.errors = '';
        this.leagueService.deleteUserFromLeague(league.form.controls.leagueId)
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

    sortLeaguesByID(unsortedLeagues) {
        this.filteredLeagues = unsortedLeagues.sort((LeagueA: LeagueUserDetails, LeagueB: LeagueUserDetails) => {
            return LeagueA.leagueId - LeagueB.leagueId;
        });
    }

    sortLeaguesByName(unsortedLeagues) {
        this.filteredLeagues = unsortedLeagues.sort((LeagueA: LeagueDetails, LeagueB: LeagueDetails) => {
            return LeagueA.leagueName.localeCompare(LeagueB.leagueName);
        });
    }

    sortLeaguesByTeams(unsortedLeagues) {
        this.filteredLeagues = unsortedLeagues.sort((LeagueA: League, LeagueB: League) => {
            return LeagueB.userCount - LeagueA.userCount;
        });
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


    /*need to find something to add leagues too, so we need to change the team value */


}


import { Component } from '@angular/core';
import { ModalService } from '../app/shared/services/modal.service'
import { HttpClient } from '@angular/common/http';
import { Player } from '../app/player/player';
import { PlayerService } from '../app/shared/services/player.service';
import { TournamentService } from '../app/shared/services/tournament.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  modalService: ModalService;

  removeModal() {
    this.modalService.destroy();
  }
  x: number = 0;
  i: number = 0;
  row: number = 0;

  data: any;
  leaderboard: any;
  tour: any;
  tournament: any;
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  isRequesting: any;
  errors: any;

  constructor(private http: HttpClient, private playerService: PlayerService, private tournamentService: TournamentService) { }

  ngOnInit() {

    
    fetch("https://fantasyfairway.azurewebsites.net/api/auth/check", { method: "GET", mode: "cors", headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token")}` } })
      .then(function (response) {
        if (response.status == 401) {
          localStorage.removeItem("auth_token");
        }
      })
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
  getTour(leaderboard) {
    for (this.x; this.x < 3; this.x++) {
      if (leaderboard[this.x].Tour == "PGA Tour") {
        return (leaderboard[this.x]);
      }
    }
  }
}

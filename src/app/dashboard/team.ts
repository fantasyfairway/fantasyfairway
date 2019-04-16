import { Player } from '../player/player';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { p } from '@angular/core/src/render3';

export class Team {

    ID: Number;
    name: String;
    players: Player [] = [];
    rounds: number [] = [];
    score: Number;
    expanded: boolean;

    constructor() {
        this.ID = 0;
        this.name = "Testing";
        this.players.push(this.generatePlayers());
        this.players.push(this.generatePlayers());
        this.players.push(this.generatePlayers());
        this.players.push(this.generatePlayers());
        this.rounds.push(0,0,0,0);
        this.score = -3;
        this.expanded = false;
    }

    generatePlayers()
    {
        return {ID: 0, Name: "Test", Country: "USA", Rounds: [0,0,0,0], CurrentPosition:"Last", Value: 500, Selected: false}
    }

    validate()
    {
        let v: number;
        this.players.forEach(player => {
            v += player.Value;
        });
        if(v >= 1000 && v <= 1000){return true;}
        else{return false;}
    }
}
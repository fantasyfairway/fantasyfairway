import { League } from '../league/league';
import { Team } from '../dashboard/team'
import { Player } from '../player/player';
import { User } from './user';


export class UserLeagues {

    users: User[] = [];
    leagues: League[] = [];
    

    constructor(user, league) {
        this.users.push(user);
        this.leagues.push(league);
    }
}
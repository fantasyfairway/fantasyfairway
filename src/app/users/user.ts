import { League } from '../league/league';


export class User {

    UserID: number;
    Name: string;
    UserName: string;
    Email: string;
    Leagues: League[] = [];
    Wins: number;


    Selected: boolean;

    constructor() {
    
    }
}
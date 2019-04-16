import {Team} from '../dashboard/team';

export class League {

    ID: number;
    name: string;
    rounds: String;
    sum: Number;
    userCount: number;
    active: boolean;
    teams: Team[] = [];

    constructor() {

    }
}
import {PipeTransform, Pipe} from '@angular/core';
import {Player} from "./player";

@Pipe({
    name: 'playerFilter'
})
export class PlayerFilterPipe implements PipeTransform
{
    transform(players: Player[], searchTerm: string): Player[] {
        if (!players || !searchTerm) {
            return players;
        }

        return players.filter(player => player.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}

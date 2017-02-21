/**
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

import * as io from 'socket.io-client';

export class PlayerManager {

    socket: any;
    players: Player[];

    constructor() {
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('wsValidateName', (name: string, id: any) => {
            this.socket.emit('swNameValidated', this.validateName(name), id);
        });

        this.socket.on('wsAddPlayer', (roomId: number, name: string) => {
            this.addPlayer({ roomId: roomId, name: name });
        });

        this.players = [];
    }

    validateName(name: string): boolean {

        let validity = this.players.find(p => (p.name === name)) === undefined;
        validity = validity && name.length > 3 && name.charAt(0) !== " " && name.charAt(name.length - 1) !== " ";
        console.log("The name " + name + " is" + (validity ? "" : " not") + " valid");
        return validity;
    }

    addPlayer(player: Player) {
        console.log("Name added : " + player.name);
        //this.playerNames.push(name);
        this.players.push(player);
    }

    removePlayer(name: string) {
        let player = this.players.find(p => (p.name === name));
        if (player !== undefined) {
            this.players.splice(this.players.indexOf(player));
        }
    }
}

interface Player {
    roomId: number;
    name: string;
}
import { Component, OnInit } from '@angular/core';
import { SocketHandler } from '../modules/socketHandler.module';

@Component({
    moduleId: module.id,
    selector: 'chat-comp',
    templateUrl: '/assets/templates/chat.component.html'
})
export class ChatComponent implements OnInit {
    socket: any;
    msg = new Message("");
    msgList = new Array<Message>();
    openWindow = window;
    attemptingToConnect = false;

    ngOnInit() {
        this.socket = SocketHandler.requestSocket('http://localhost:3000');
        console.log(this.socket);

        this.socket.on("connect_error", () => {
            this.attemptingToConnect = true;
        });

        this.socket.on('message sent', (msg: string) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('command sent', (msg: string) => {
            this.attemptingToConnect = false;
            msg += " JE SUIS UNE COMMANDE. (TODO : remplacer par de la couleur)\n";
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user connect', (msg: string) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user disconnect', (msg: string) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });
    }

    onSubmit() {
        if (this.msg.message !== undefined && this.msg.message !== null) {
            if (this.msg.message.replace(/\s+/g, "") !== "") {
                //Remove all spaces as a test to prevent sending huge empty messages
                this.socket.emit('chat message', this.msg.message);
            }
        }
    }

    onResize(event: any) {
        this.openWindow = window;

    }

    keyboardInput(event: KeyboardEvent) {
        //TODO: gérer le input à partir d'ici
    }
}

export class Message {
    username = "";
    submessage = "";

    constructor(public message: string) {
        let split = message.split("~", 2);
        this.username = split[0];
        this.submessage = split[1];
    }
}

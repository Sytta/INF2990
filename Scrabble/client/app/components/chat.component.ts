import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { SocketHandler } from '../modules/socketHandler.module';
import { Message, IMessageFromServer } from '../classes/message';

@Component({
    moduleId: module.id,
    selector: 'chat-comp',
    templateUrl: '/assets/templates/chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    private socket: any;
    private msgFromClient: string;
    private msgList = new Array<Message>();
    private openWindow = window;
    private attemptingToConnect = false;
    @ViewChild('chatbox') private chatContainer: ElementRef;

    public ngOnInit() {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on("connect_error", () => {
            this.attemptingToConnect = true;
        });

        this.socket.on('message sent', (msg: IMessageFromServer) => {
            this.addMessage(msg);
        });

        this.socket.on('command sent', (msg: IMessageFromServer) => {
            this.addMessage(msg, true);
        });

        this.socket.on('user connect', (msg: IMessageFromServer) => {
            this.addMessage(msg);
        });

        this.socket.on('user disconnect', (msg: IMessageFromServer) => {
            this.addMessage(msg);
        });
    }

    public ngAfterViewChecked() {
        this.autoscroll();
    }

    public onSubmit() {
        if (this.msgFromClient !== undefined && this.msgFromClient !== null) {
            if (this.msgFromClient.replace(/\s+/g, "") !== "") {
                // Remove all spaces as a test to prevent sending huge empty messages
                this.socket.emit('chat message', this.msgFromClient);
            }
        }
    }

    public onResize(event: any) {
        this.openWindow = window;
    }

    private addMessage(msg: IMessageFromServer, isCommand?: boolean) {
        this.attemptingToConnect = false;
        isCommand === undefined ? this.msgList.push(new Message(msg)) : this.msgList.push(new Message(msg, isCommand));
    }

    private autoscroll(): void {
        // Try scrolling the chatbox so the new message can be seen after a view update
        try {
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log("Error trying to scroll chatbox.");
        }
    }

    public keyboardInput(event: KeyboardEvent) {
        // TODO: gérer le input à partir d'ici
    }
}

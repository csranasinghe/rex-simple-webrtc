import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  isInitiator: boolean;
  constructor(private socket: Socket) {
    socket.on('full', (room) => {
      console.log('Room ' + room + ' is full');
    });
    socket.on('empty', (room) => {
      this.isInitiator = true;
      console.log('Room ' + room + ' is empty');
    });
    socket.on('join', (room) => {
      console.log('Making request to join room ' + room);
      console.log('You are the initiator!');
    });

    socket.on('log', (array) => {
      console.log.apply(console, array);
    });
  }

  joinChannel(room: string) {
    console.log("Joining room : " + room);
    this.socket.emit('create or join', room);
  }

  sendMessage(msg: string) {
    this.socket.emit(msg);
  }
  getMessage() {
    return this.socket.fromEvent('message');
  }

}

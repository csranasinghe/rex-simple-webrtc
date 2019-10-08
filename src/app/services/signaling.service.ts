import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  socket: any;
  connected: boolean = true;
  constructor() {
    this.socket = io("http://localhost:8888");
    this.socket.on('message', (data) => {
      this.connected = false;
      console.log("Message recieved: " + JSON.stringify(data));
    });
  }

  joinRoom(roomName: string, userId: string) {
    this.socket.emit('message', JSON.stringify({ type: "joinRoom", msg: { user_id: userId } }));
    console.log("joinRoom request sent by: " + userId + " to join room " + roomName);
  }

  leaveRoom(roomName: string, userId: string) {
    this.socket.emit('message', JSON.stringify({ type: "leaveRoom", msg: { user_id: userId } }));
    console.log("leaveRoom request sent by: " + userId + " to leave room " + roomName);
  }



}

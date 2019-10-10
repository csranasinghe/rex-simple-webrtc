import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  socket: any;
  RTCPeerConnection: any;
  user: string;
  answer: any;
  offer: any;

  private _connected = new BehaviorSubject<string>("disconnected");
  connected$ = this._connected.asObservable();



  constructor() {
    this.socket = io("https://rex-signalling-server.herokuapp.com");
    this.socket.on('message', (message) => {
      console.log("Message sent by: " + this.socket.id);
      let data = message;

      switch (data.type) {
        case "joinRoom":
          this._connected.next(data.status);
          console.log("Joinroom recieved: " + JSON.stringify(data));
          if (this.user == "chathu") {
            this.RTCPeerConnection.addTransceiver("audio");
            this.RTCPeerConnection.addTransceiver("video");
            this.RTCPeerConnection.createOffer().then(offer => {
              this.RTCPeerConnection.setLocalDescription(offer);
              this.socket.emit('message', JSON.stringify({ type: "offer", 'offer': { userid: "chamath", data: offer }, msg: { user_id: "chathu" } }));
            });

          }

          break;
        case "leaveRoom":
          this._connected.next(data.status);
          if (this.user != "chamath") {
            // let senders = this.RTCPeerConnection.getSenders();
            // for (let i = 0; i < senders.length; i++) {
            //   this.RTCPeerConnection.removeTrack(senders[i]);
            // }
            this.RTCPeerConnection.close();
            console.log("Leaveroom recieved: " + JSON.stringify(data));
          }
          break;
        case "offer":
          this.offer = data.offer.data;
          if (this.user == "chamath") {
            this.RTCPeerConnection.setRemoteDescription(new RTCSessionDescription(this.offer)).then(() => {
              this.RTCPeerConnection.createAnswer().then(answer => {
                this.RTCPeerConnection.setLocalDescription(new RTCSessionDescription(answer)).then;
                this.socket.emit('message', JSON.stringify({ type: "answer", answer: { userid: "chathu", data: answer }, msg: { user_id: "chamath" } }));
                console.log("Answer sent.");
              });
            })
          }
          break;
        case "answer":
          this.answer = data.answer.data;
          this.RTCPeerConnection.setRemoteDescription(new RTCSessionDescription(this.answer));
          console.log("Answer recieved");
          break;
        case "icecandidate":
          console.log("Ice recieved");
          let candidate = JSON.parse(data.candidate);
          this.RTCPeerConnection.addIceCandidate(new RTCIceCandidate(candidate.ice));
          break;
        default:
          console.log("Error msg: " + JSON.stringify(data));
      }
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


  sendCandidates(roomName: string, msg: string) {
    this.socket.emit('message', JSON.stringify({ type: "icecandidate", candidate: msg }));
    console.log("Ice candidates are sent by" + JSON.stringify(this.user));
  }

}

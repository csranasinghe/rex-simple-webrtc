import { Component, OnInit } from '@angular/core';
import { SignalingService } from '../../services/signaling.service';
import { Subscription } from 'rxjs';

declare let RTCPeerConnection: any;

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {
  pc: any;
  connected: string;
  subscription: Subscription;
  constructor(private signalingService: SignalingService) { }

  ngOnInit() {
    this.subscription = this.signalingService.connected$.subscribe((data) => this.connected = data);
  }

  ngAfterViewInit() {
    this.setupWebrtc();
  }

  setupWebrtc() {

    try {
      this.pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.services.mozilla.com" },
          { urls: "stun:stun.l.google.com:19302" }
        ]
      }, { optional: [] });
    } catch (error) {
      console.log(error);
    }

    this.signalingService.RTCPeerConnection = this.pc;
    this.signalingService.user = "chathu";


  }

  joinRoom() {
    this.signalingService.joinRoom("abcd", "chathu");

  }

  leaveRoom() {
    this.signalingService.leaveRoom("abcd", "chathu");
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
    this.leaveRoom();
  }

}

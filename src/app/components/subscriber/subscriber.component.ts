import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild("remoteVideo")
  public remoteVideo: ElementRef;
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


    this.signalingService.user = "chathu";
    this.pc.onicecandidate = event => {
      event.candidate ? this.signalingService.sendCandidates("abcd", JSON.stringify({ ice: event.candidate })) : console.log("Sent All Ice");
    }
    this.pc.ontrack = event =>
      (this.remoteVideo.nativeElement.srcObject = event.streams[0]); // use ontrack


    this.signalingService.RTCPeerConnection = this.pc;

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

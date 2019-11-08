import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as uuid from 'uuid';
import * as io from 'socket.io-client'
import { SignalingService } from '../../services/signaling.service';
import { MediaHandler } from '../../webrtc-connector/classes/media-handler';

declare let RTCPeerConnection: any;

@Component({
  selector: 'app-broadcaster',
  templateUrl: './broadcaster.component.html',
  styleUrls: ['./broadcaster.component.css']
})
export class BroadcasterComponent implements OnInit {
  pc: any;
  callActive: boolean = false;
  senderId: string;
  localVideoStream: any;
  socket: any;

  @ViewChild("localVideo")
  public localVideo: ElementRef;

  @ViewChild("error")
  public errorText: ElementRef;

  constructor(private signalingService: SignalingService) { }

  ngOnInit() {
  }


  ngAfterViewInit() {

  }

  public setupWebRtc() {

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



    this.pc.onremovestream = event => {
      console.log('Stream Ended');
    }

    // this.pc.ontrack = ev => {
    //   if (ev.streams && ev.streams[0]) {
    //     this.localVideo.nativeElement.srcObject = ev.streams[0];
    //   } else {
    //     let inboundStream = new MediaStream(ev.track);
    //     this.localVideo.nativeElement.srcObject = inboundStream;
    //   }

    // }


    this.signalingService.user = "chamath";

    this.pc.onicecandidate = event => {
      event.candidate ? this.signalingService.sendCandidates("abcd", JSON.stringify({ ice: event.candidate })) : console.log("Sent All Ice");
    }

    this.signalingService.RTCPeerConnection = this.pc;
    this.joinRoom();
  }

  async showMe() {
    let mediaHandler = new MediaHandler();
    let l = await mediaHandler.init(); // wait until initialization finishes. Since this is a async function
    console.log(await mediaHandler.getStream());
  }

  stopBroadcast() {

    this.leaveRoom();


    let senders = this.pc.getSenders();
    for (let i = 0; i < senders.length; i++) {
      this.pc.removeTrack(senders[i]);
    }

    this.localVideo.nativeElement.srcObject = null;

    this.pc.close();
    this.callActive = false;

    console.log("Stop broadcast.");
  }

  startBroadcast() {
    console.log("Start  broadcast.");
    this.showMe();
    //this.setupWebRtc();
  }

  leaveRoom() {
    this.signalingService.leaveRoom("abcd", "chamath");
  }

  joinRoom() {
    this.signalingService.joinRoom("abcd", "chamath");
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.leaveRoom();
  }

}

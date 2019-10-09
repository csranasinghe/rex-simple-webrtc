import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as uuid from 'uuid';
import * as io from 'socket.io-client'
import { SignalingService } from '../../services/signaling.service';

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
    this.setupWebRtc();
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

    this.showMe();
    this.joinRoom();


  }


  showMe() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream => {
          this.localVideoStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.callActive = true;

          for (let track of stream.getTracks()) {
            this.pc.addTrack(track, stream);
          }
        })
        .catch(err => {
          this.errorText.nativeElement.html = "Error while getting user media";
        });
    } else {

      this.errorText.nativeElement.html = "Error while getting user media";
    }
  }

  stopBroadcast() {
    this.pc.close();
    let tracks = this.localVideoStream.getTracks();
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }
    this.callActive = false;
    this.leaveRoom();
    console.log("Stop broadcast.");
  }

  startBroadcast() {
    console.log("Start  broadcast.");
    this.setupWebRtc();
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

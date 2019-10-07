import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as uuid from 'uuid';
import { Socket } from 'ngx-socket-io';
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

  @ViewChild("localVideo")
  public localVideo: ElementRef;

  @ViewChild("error")
  public errorText: ElementRef;

  constructor(private socket: SignalingService) { }

  ngOnInit() {

  }


  public ngAfterViewInit() {
    this.setupWebRtc();
  }

  public setupWebRtc() {
    this.senderId = uuid.v4();
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
    this.pc.onicecandidate = event => {
      event.candidate ? this.socket.sendMessage(JSON.stringify({ ice: event.candidate })) : console.log("Sent All Ice");
    }

    this.pc.onremovestream = event => {
      console.log('Stream Ended');
    }
    this.showMe();
  }


  showMe() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream => {
          this.localVideoStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.callActive = true;
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
    console.log("Stop broadcast.");
  }

  public startBroadcast() {
    console.log("Start  broadcast.");
    this.setupWebRtc();
    this.socket.joinChannel("chamath");
  }

}

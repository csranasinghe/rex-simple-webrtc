import { Component, OnInit } from '@angular/core';
import { SignalingService } from '../../services/signaling.service';
@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {

  connected: boolean;
  constructor(private signalingService: SignalingService) { }

  ngOnInit() {
    this.connected = this.signalingService.connected;
  }

  ngAfterViewInit() {

  }

  joinRoom() {
    this.signalingService.joinRoom("abcd", "chathu");
  }

  leaveRoom() {
    this.signalingService.leaveRoom("abcd", "chathu");
  }

}

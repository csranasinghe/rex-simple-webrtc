import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BroadcasterComponent } from './components/broadcaster/broadcaster.component';
import { SubscriberComponent } from './components/subscriber/subscriber.component';
import { HomeComponent } from './components/home/home.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:8888', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    BroadcasterComponent,
    SubscriberComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

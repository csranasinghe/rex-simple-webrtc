import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BroadcasterComponent } from './components/broadcaster/broadcaster.component'
import { SubscriberComponent } from './components/subscriber/subscriber.component'
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'broadcaster', component: BroadcasterComponent },
    { path: 'subscriber', component: SubscriberComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
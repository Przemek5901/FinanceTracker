import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { PushService } from './services/push.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, NavbarComponent],
})
export class AppComponent implements OnInit {
  constructor(private pushService: PushService, private swPush: SwPush) {}

  ngOnInit(): void {
    this.initializePushNotifications();
  }

  private initializePushNotifications() {
    this.pushService.subscribeToNotifications();
  }
  title = 'finance-tracker';
}

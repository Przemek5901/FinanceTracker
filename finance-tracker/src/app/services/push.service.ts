import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class PushService {
  readonly VAPID_PUBLIC_KEY =
    'BMlXIzNWhKNSTT8aSrMxX-z8_EIa9KqP9rK2dSs-P33qU69gGKjpaoX_bLUXkIlzxLrtN7OlHu6XBbrEhibNeuk';

  constructor(private swPush: SwPush, private http: HttpClient) {
    this.subscribeToNotifications();
    this.listenForPushMessages();
  }

  async subscribeToNotifications() {
    try {
      if (!this.swPush.isEnabled || Notification.permission === 'denied')
        return;

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
      }

      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      });

      await this.http.post(`${environment.apiUrl}/subscribe`, sub).toPromise();
    } catch (err) {
      console.error('Błąd subskrypcji:', err);
    }
  }

  private listenForPushMessages() {
    if (!this.swPush.isEnabled) return;

    // this.swPush.messages.subscribe((message) => {
    // });

    this.swPush.notificationClicks.subscribe(({ notification }) => {
      if (notification?.data?.url) {
        window.open(notification.data.url, '_blank');
      }
    });
  }
}

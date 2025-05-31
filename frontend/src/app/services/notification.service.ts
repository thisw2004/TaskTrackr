import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';
  // Updated VAPID public key from your screenshot
  private readonly VAPID_PUBLIC_KEY = 'BKWr2-ShDbsTGlPY3qSIvhNJGBtT9lWmQXk1eWTsZy1u4xQ7d5Ne8c2jouYIf5Dn7pUFrT8HSDAEBLPU4HNVJeI';

  constructor(
    private http: HttpClient,
    private swPush: SwPush
  ) {
    // Check if service worker is enabled on init
    if (this.swPush.isEnabled) {
      console.log('Service worker is enabled');
    } else {
      console.warn('Service worker is not enabled - push notifications will not work');
    }
  }

  // Request notification permission and subscribe to push
  async requestSubscription() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return Promise.reject('Notifications not supported');
    }

    try {
      // First request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return Promise.reject('Notification permission denied');
      }
      
      // Check if service worker is enabled
      if (!this.swPush.isEnabled) {
        console.warn('Push notifications not supported - service worker not active');
        return Promise.reject('Push notifications not supported');
      }
      
      // Attempt to get public key from server, fall back to hardcoded key
      let publicKey = this.VAPID_PUBLIC_KEY;
      try {
        const response = await firstValueFrom(this.http.get<{publicKey: string}>(`${this.apiUrl}/notifications/key`));
        if (response && response.publicKey) {
          publicKey = response.publicKey;
        }
      } catch (error) {
        console.warn('Failed to get public key from server, using fallback', error);
      }
      
      // Subscribe to push
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: publicKey
      });
      
      // Send subscription to backend
      try {
        await firstValueFrom(this.http.post(`${this.apiUrl}/notifications/subscribe`, subscription));
        console.log('Subscription sent to server successfully');
        return Promise.resolve({ success: true });
      } catch (error) {
        console.error('Failed to send subscription to server', error);
        return Promise.reject('Failed to register with notification server');
      }
    } catch (err) {
      console.error('Error in requestSubscription:', err);
      return Promise.reject(err);
    }
  }

  // Send test notification
  async sendTestNotification() {
    try {
      // Try to use push notifications if supported
      if (this.swPush.isEnabled) {
        console.log('Attempting to send push notification via backend');
        try {
          await firstValueFrom(this.http.post(`${this.apiUrl}/notifications/test`, {}));
          return { success: true, method: 'push' };
        } catch (error) {
          console.error('Error sending push notification:', error);
          // Fall back to local notification
          this.showLocalNotification(
            'TaskTrackr Notification', 
            'This is a local notification (backend unavailable)'
          );
          return { success: true, method: 'local', reason: 'backend-error' };
        }
      } else {
        // Fall back to local notification
        console.log('Push notifications not supported, using local notification');
        this.showLocalNotification(
          'TaskTrackr Notification', 
          'This is a local notification (push not supported)'
        );
        return { success: true, method: 'local', reason: 'no-push-support' };
      }
    } catch (error) {
      console.error('Error in sendTestNotification:', error);
      return { success: false, error };
    }
  }

  // Show a local notification
  showLocalNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/assets/icons/icon-72x72.png'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      return true;
    }
    return false;
  }
}
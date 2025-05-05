import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  darkMode = false;
  notificationsEnabled = true;
  emailNotifications = false;
  language = 'en';
  
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    // In a real app, this would apply theme changes
  }
  
  saveSettings(): void {
    // In a real app, this would save to user preferences
    console.log('Settings saved:', {
      darkMode: this.darkMode,
      notificationsEnabled: this.notificationsEnabled,
      emailNotifications: this.emailNotifications,
      language: this.language
    });
  }
}

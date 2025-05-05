import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  showDevSettings = false;
  debugMode = false;
  apiUrl = environment.apiUrl;

  // Store the Swagger URL in a property
  swaggerUrl = 'http://localhost:3000/api/swagger';

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Nothing specific needed on init
  }

  toggleDevSettings(): void {
    this.showDevSettings = !this.showDevSettings;
  }

  openSwaggerDocs(): void {
    // Open swagger in a new tab using the full URL
    window.open(this.swaggerUrl, '_blank');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        // Success message could be shown with a snackbar
        console.log('URL copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }
}

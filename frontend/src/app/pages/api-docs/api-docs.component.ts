import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-api-docs',
  template: `
    <div class="page-container">
      <h1>API Documentation</h1>
      <div class="card-container">
        <iframe 
          *ngIf="swaggerUrl" 
          [src]="swaggerUrl" 
          width="100%" 
          height="800px" 
          frameborder="0"
        ></iframe>
      </div>
    </div>
  `,
  styles: [`
    iframe {
      border: none;
    }
  `]
})
export class ApiDocsComponent implements OnInit {
  swaggerUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // Sanitize the URL to prevent security issues when embedding iframes
    this.swaggerUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/swagger');
  }
}
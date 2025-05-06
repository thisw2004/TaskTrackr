import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges {
  @Input() isMenuOpen = true;
  @Output() logoutEvent = new EventEmitter<void>();
  
  ngOnChanges() {
    // Force change detection
    setTimeout(() => {}, 0);
  }
  
  onLogout(): void {
    this.logoutEvent.emit();
  }
}
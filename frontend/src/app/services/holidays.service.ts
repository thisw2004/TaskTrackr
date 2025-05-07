import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Holiday {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private baseUrl = 'https://date.nager.at/api/v3';
  
  constructor(private http: HttpClient) {}
  
  // Get holidays for the current year in the Netherlands
  getHolidays(year: number = new Date().getFullYear(), countryCode: string = 'NL'): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.baseUrl}/PublicHolidays/${year}/${countryCode}`);
  }
  
  // Get upcoming holidays
  getUpcomingHolidays(): Observable<Holiday[]> {
    const today = new Date();
    const year = today.getFullYear();
    return this.getHolidays(year);
  }
}
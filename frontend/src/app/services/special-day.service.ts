import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

interface SpecialDayResult {
  isSpecialDay: boolean;
  name?: string;
  source?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpecialDayService {
  constructor(private http: HttpClient) {}
  
  // Some notable days from daysoftheyear.com
  private daysOfTheYear = [
    { month: 1, day: 1, name: "Nieuwjaarsdag", description: "Vandaag is Nieuwjaarsdag!" },
    { month: 2, day: 14, name: "Valentijnsdag", description: "Vandaag is Valentijnsdag!" },
    { month: 3, day: 14, name: "Pi Dag", description: "Vandaag is Pi Dag (3.14)!" },
    { month: 4, day: 22, name: "Dag van de Aarde", description: "Vandaag is Dag van de Aarde!" },
    { month: 5, day: 4, name: "Star Wars Dag", description: "Vandaag is Star Wars Dag! May the 4th be with you!" },
    { month: 6, day: 1, name: "Internationale Dag van Ouders", description: "Vandaag is Internationale Dag van Ouders!" },
    { month: 7, day: 7, name: "Wereld Chocolade Dag", description: "Vandaag is Wereld Chocolade Dag!" },
    { month: 8, day: 8, name: "Internationale Kattendag", description: "Vandaag is Internationale Kattendag!" },
    { month: 9, day: 19, name: "Praat als een Piraat Dag", description: "Ahoy! Vandaag is Praat als een Piraat Dag!" },
    { month: 10, day: 31, name: "Halloween", description: "Vandaag is Halloween!" },
    { month: 11, day: 13, name: "Wereld Vriendelijkheid Dag", description: "Vandaag is Wereld Vriendelijkheid Dag!" },
    { month: 12, day: 21, name: "Kortste Dag", description: "Vandaag is de Kortste Dag van het jaar!" }
  ];
  
  checkSpecialDay(): Observable<SpecialDayResult> {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Format for date.nager.at API
    const todayFormatted = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    console.log(`Checking for special day: ${todayFormatted}`);
    
    // Get public holidays from date.nager.at for Netherlands
    const holidaysUrl = `https://date.nager.at/api/v3/publicholidays/${year}/NL`;
    console.log(`Fetching holidays from: ${holidaysUrl}`);
    
    // First check public holidays
    return this.http.get<Holiday[]>(holidaysUrl).pipe(
      tap(holidays => {
        console.log('API Response from date.nager.at:', holidays);
      }),
      switchMap(holidays => {
        // Check if today is a public holiday
        const holiday = holidays.find(h => h.date === todayFormatted);
        if (holiday) {
          console.log('Found public holiday:', holiday);
          return of({
            isSpecialDay: true,
            name: holiday.localName, // Gebruik localName in plaats van name voor Nederlandse benaming
            source: 'date.nager.at',
            description: `Vandaag is ${holiday.localName}!`
          });
        }
        
        console.log('No public holiday found, checking daysoftheyear.com data');
        // If not a public holiday, check daysoftheyear.com
        console.log('Current day/month:', `${month}/${day}`);
        console.log('Available special days:', this.daysOfTheYear);
        
        const specialDay = this.daysOfTheYear.find(d => d.month === month && d.day === day);
        if (specialDay) {
          console.log('Found special day from daysoftheyear.com:', specialDay);
          return of({
            isSpecialDay: true,
            name: specialDay.name,
            source: 'daysoftheyear.com',
            description: specialDay.description
          });
        }
        
        // If no special day found
        console.log('No special day found for today');
        return of({
          isSpecialDay: false,
          description: "Vandaag is een normale dag."
        });
      }),
      catchError(error => {
        console.error('Error checking special days', error);
        return of({ 
          isSpecialDay: false,
          description: "Vandaag is een normale dag."
        });
      })
    );
  }
}
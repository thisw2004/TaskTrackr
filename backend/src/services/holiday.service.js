const fetch = require('node-fetch');

// Service to interact with external holiday APIs
class HolidayService {
  constructor() {
    this.nagerApiBaseUrl = 'https://date.nager.at/api/v3';
    this.daysOfYearBaseUrl = 'https://www.daysoftheyear.com/api';  // Example - would need actual API key
  }

  // Get public holidays for a specific country and year from Nager.Date API
  async getPublicHolidays(year, countryCode = 'NL') {
    try {
      const response = await fetch(`${this.nagerApiBaseUrl}/PublicHolidays/${year}/${countryCode}`);
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching public holidays:', error);
      return [];
    }
  }

  // Get upcoming holidays within the next 30 days
  async getUpcomingHolidays(countryCode = 'NL') {
    const now = new Date();
    const year = now.getFullYear();
    const holidays = await this.getPublicHolidays(year, countryCode);
    
    if (!holidays || holidays.length === 0) {
      return [];
    }
    
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    // Filter holidays within the next 30 days
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= now && holidayDate <= thirtyDaysFromNow;
    });
  }

  // Generate task suggestions based on upcoming holidays
  async generateHolidaySuggestions() {
    const upcomingHolidays = await this.getUpcomingHolidays();
    
    // Transform holidays into task suggestions
    return upcomingHolidays.map(holiday => ({
      title: `Prepare for ${holiday.name}`,
      description: `${holiday.name} is coming up on ${new Date(holiday.date).toLocaleDateString()}. Make sure you're prepared!`,
      suggestedDeadline: new Date(holiday.date),
      type: 'holiday',
      metadata: {
        holidayName: holiday.name,
        holidayDate: holiday.date
      }
    }));
  }
}

module.exports = new HolidayService();

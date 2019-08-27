import { daysOfWeek } from './constants';
import { Day } from './types';

export function calculateNumberOfRows(arrayOfDays: any[]) {
    //console.log('arrayOfDays', arrayOfDays);
    if (arrayOfDays.length === 0) return 0;
    if (arrayOfDays.length === 1) return 1;
    var numberOfRows = 1;
    for (var i = 1; i < arrayOfDays.length; i++) {
      const previousDay = arrayOfDays[i - 1].day;
      const currentDay = arrayOfDays[i].day;
      if (daysOfWeek.indexOf(currentDay) - daysOfWeek.indexOf(previousDay) <= 0) {
        numberOfRows = numberOfRows + 1;
      }
    }
    return numberOfRows;
  }

  /** Expects format YYY-MM-dd */
  export function dateToDayOfWeek(date: string): Day {
    const dateStrSplit = date.split('-');
    const newDate = new Date(parseInt(dateStrSplit[0]), parseInt(dateStrSplit[1])-1, parseInt(dateStrSplit[2]) );
    const day = newDate.getDay();
    switch(day){
      case 0:
        return Day.Sunday;
      case 1:
        return Day.Monday;
      case 2:
        return Day.Tuesday;
      case 3:
        return Day.Wednesday;
      case 4:
        return Day.Thursday
      case 5:
        return Day.Friday
      case 6:
        return Day.Saturday
      default:
        throw "Something wrong with date provided!"
    }
  }

  /**
   * e.g. Rosh Hashana -> roshhashana
   * @param name 
   */
  export const minifyYTName = (name: string) => {
    return name.replace(' ', '').toLowerCase();
  }
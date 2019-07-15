function calculateNumberOfRows(arrayOfDays: any[]) {
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
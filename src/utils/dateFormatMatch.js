export function dateFormatMatch(dates) {
    if (
      /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01]) - \d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(
        dates
      )
    ) {
      dates = dates.split(' ')
      let start = dates[0]
      let end = dates[2]
    
      let dateRange = { start: start, end: end }
      return dateRange
    } else {
      return null
    }
  }
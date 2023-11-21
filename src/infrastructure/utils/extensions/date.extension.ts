export function formatVcloudDate(currentDate: Date): string {
  // const currentDate = new Date();

  // Get the formatted date and time string from toISOString()
  const isoString = currentDate.toISOString();

  // Extract individual components
  const yearMonthDay = isoString.slice(0, 10);
  const time = isoString.slice(11, 23);
  const timeZone = isoString.slice(23);

  // Create the formatted date and time string
  const formattedDateTime = `${yearMonthDay}T${time}${timeZone}`;

  return formattedDateTime;
}

export function getDateMinusDay(date: Date, day: number) {
  return new Date(date.setDate(date.getDate() - day));
}

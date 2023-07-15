export async function dayDiff(endDate: Date): Promise<number> {
  const startDate = new Date();
  const endADate = new Date(endDate);
  const difference = endADate.getTime() - startDate.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
}

export function monthDiff(startDate: Date, endDate: Date): number {
  let months: number;
  months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  return months <= 0 ? 0 : months;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function addMonths(input: Date, months: number): Date {
  const date = new Date(input);
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  date.setDate(
    Math.min(
      new Date(input).getDate(),
      getDaysInMonth(date.getFullYear(), date.getMonth() + 1),
    ),
  );
  return date;
}

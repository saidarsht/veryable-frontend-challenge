import moment from "moment";

export function formatOpDate(date: string): string {
  return moment(date).format("MMM D, YYYY");
}

export function formatTimeRange(start: string, end: string): string {
  const startMoment = moment(start);
  const endMoment = moment(end);
  return `${startMoment.format("h:mm A")} – ${endMoment.format("h:mm A")}`;
}


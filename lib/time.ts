export type WorkStatus = "Best Time Now" | "Good Time" | "Lunch Time" | "After Hours" | "Weekend" | "Not Recommended";

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return { weekday: value("weekday"), hour: Number(value("hour")) % 24, minute: Number(value("minute")) };
}

export function getWorkStatus(date: Date, timeZone: string): WorkStatus {
  const { weekday, hour, minute } = zonedParts(date, timeZone);
  if (weekday === "Sat" || weekday === "Sun") return "Weekend";
  const total = hour * 60 + minute;
  if (total >= 540 && total <= 690) return "Best Time Now";
  if (total >= 720 && total <= 810) return "Lunch Time";
  if (total >= 840 && total <= 1050) return "Good Time";
  if (total > 1110 || total < 480) return "After Hours";
  return "Not Recommended";
}

export function suggestedAction(status: WorkStatus) {
  if (status === "Best Time Now") return "Call now";
  if (status === "Good Time") return "Send WhatsApp";
  if (status === "Lunch Time") return "Send email";
  if (status === "Weekend") return "Schedule follow-up";
  return "Wait until local morning";
}

export function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

export function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, month: "short", day: "numeric", weekday: "short" }).format(date);
}

export function formatISODate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

import { useEffect, useState } from "react";

export type Status = "completed" | "active" | "pending";
export type RegistrationState = "upcoming" | "open" | "closed";

export interface BadgeText {
  active: string;     // while this step is happening
  pending: string;    // before this step starts
  completed: string;  // after this step has ended
}

export interface RawStep {
  title: string;
  start: string;        // "YYYY-MM-DD"
  end: string;          // "YYYY-MM-DD"
  displayDate: string;  // shown on the card
  badge: BadgeText;     // shown in the hero's top bar
}

// inclusive dates
export const rawTimelineSteps: RawStep[] = [
  {
    title: "Registration Opens",
    start: "2026-11-10",
    end: "2026-11-25",
    displayDate: "November 10, 2026",
    badge: {
      active: "Registration is open until November 25",
      pending: "Registration opens November 10, 2026",
      completed: "Registration has opened",
    },
  },
  {
    title: "Application Review",
    start: "2026-11-26",
    end: "2026-11-29",
    displayDate: "November 23, 2026",
    badge: {
      active: "Applications are being reviewed",
      pending: "Application review starts November 23, 2026",
      completed: "Applications have been reviewed",
    },
  },
  {
    title: "Main Event",
    start: "2026-11-30",
    end: "2026-12-02",
    displayDate: "November 30 - December 02, 2026",
    badge: {
      active: "Codefest is happening now",
      pending: "Main event starts November 25, 2026",
      completed: "Main event is complete",
    },
  },
  {
    title: "Results & Awards",
    start: "2026-12-02",
    end: "2026-12-02",
    displayDate: "December 02, 2026",
    badge: {
      active: "Results are being announced",
      pending: "Results announced November 27, 2026",
      completed: "Codefest 2026 is over",
    },
  },
];

const findStep = (title: string): RawStep => {
  const step = rawTimelineSteps.find((s) => s.title === title);
  if (!step) throw new Error(`Timeline is missing a "${title}" step`);
  return step;
};

const formatLong = (ymd: string): string =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const opensStep = findStep("Registration Opens");

export const isMainEvent = (today: string = todayString()): boolean => {
  const mainEvent = rawTimelineSteps.find((s) => s.title === "Main Event");
  if (!mainEvent) throw new Error('Timeline is missing a "Main Event" step');

  return getStatus(mainEvent, today) === "active";
};

if(isMainEvent(todayString())){
    console.log("is main event");
}else{
    console.log("is not main event");
}

export const registration = {
  url: "https://docs.google.com/forms/d/e/1FAIpQLScu7YOzdz3O9q9VH8AuUj4vAKdJLjh6tWrbMnaplqSe8H7g0A/viewform?usp=dialog", // todo
  opensDate: opensStep.start,            // "YYYY-MM-DD", for comparisons
  opens: formatLong(opensStep.start),
  opensLabel: opensStep.displayDate,
  closes: opensStep.end,                 // "YYYY-MM-DD", inclusive
  closesLabel: formatLong(opensStep.end),
};

// Local date as "YYYY-MM-DD"
export function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getStatus(step: RawStep, today: string): Status {
  if (today > step.end) return "completed";
  if (today >= step.start) return "active";
  return "pending";
}

// The step happening now, otherwise the next upcoming step,
// otherwise the last step once everything has finished.
export interface CurrentPhase {
  step: RawStep;
  status: Status;
}

export function getCurrentPhase(today: string): CurrentPhase {
  const withStatus = rawTimelineSteps.map((step) => ({
    step,
    status: getStatus(step, today),
  }));
  return (
    withStatus.find((p) => p.status === "active") ??
    withStatus.find((p) => p.status === "pending") ??
    withStatus[withStatus.length - 1]
  );
}

export function getRegistrationState(today: string): RegistrationState {
  if (today < registration.opensDate) return "upcoming";
  if (today > registration.closes) return "closed";
  return "open";
}

// Re-checks the date every minute so states flip at midnight without a reload.
export function useToday(): string {
  const [today, setToday] = useState(todayString);

  useEffect(() => {
    const id = setInterval(() => {
      const now = todayString();
      setToday((prev) => (prev === now ? prev : now));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return today;
}

export const mainEvent = rawTimelineSteps.find((s) => s.title === "Main Event");
if (!mainEvent) throw new Error('Timeline is missing a "Main Event" step');

export const countdownTarget = new Date(
  `${mainEvent.start}T00:00:00+05:45`
).getTime();

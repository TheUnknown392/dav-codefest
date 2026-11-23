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
  end: string;          // "YYYY-MM-DD" (same as start for single-day steps)
  displayDate: string;  // shown on the card
  badge: BadgeText;     // shown in the hero's top bar
}

export const rawTimelineSteps: RawStep[] = [
  {
    title: "Registration Opens",
    start: "2026-06-25",
    end: "2026-06-25",
    displayDate: "June 25, 2026",
    badge: {
      active: "Registration is open",
      pending: "Registration opens June 25, 2026",
      completed: "Registration has opened",
    },
  },
  {
    title: "Application Review",
    start: "2026-07-14",
    end: "2026-07-14",
    displayDate: "July 14, 2026",
    badge: {
      active: "Applications are being reviewed",
      pending: "Application review starts July 14, 2026",
      completed: "Applications have been reviewed",
    },
  },
  {
    title: "Main Event",
    start: "2026-07-25",
    end: "2026-07-27",
    displayDate: "July 25-27, 2026",
    badge: {
      active: "Codefest is happening now",
      pending: "Main event starts July 25, 2026",
      completed: "Main event is complete",
    },
  },
  {
    title: "Results & Awards",
    start: "2026-07-27",
    end: "2026-07-27",
    displayDate: "July 27, 2026",
    badge: {
      active: "Results are being announced",
      pending: "Results announced July 27, 2026",
      completed: "Codefest 2026 is over",
    },
  },
];

// Registration window. "closes" is an assumption (day before Application Review).
export const registration = {
  opens: "2026-06-25",
  opensLabel: "June 25, 2026",
  closes: "2026-07-13",
  closesLabel: "July 13, 2026",
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
  if (today < registration.opens) return "upcoming";
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

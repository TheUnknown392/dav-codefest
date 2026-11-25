import { rawTimelineSteps } from "@/data/timeline";

// ---------- Timeline-derived dates ----------
const mainEvent = rawTimelineSteps.find((s) => s.title === "Main Event");
if (!mainEvent) throw new Error('Timeline is missing a "Main Event" step');


// count main event length in days
const DAY_MS = 24 * 60 * 60 * 1000;
const eventStart = new Date(`${mainEvent.start}T00:00:00Z`);
const eventEnd = new Date(`${mainEvent.end}T00:00:00Z`);
const dayCount = Math.round((eventEnd.getTime() - eventStart.getTime()) / DAY_MS) + 1;

const formatUTC = (d: Date, options: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString("en-US", { timeZone: "UTC", ...options });

// ---------- Event info ----------
export const eventInfo = {
  logoText: "Cognito",
  logoSrc: "/logo2.svg",
  eyebrow: "Hackathon",
  title: `Codefest ${eventStart.getUTCFullYear()}`,
  intro: "Three days of building, mentoring, and showcasing. Here's how it unfolds.",
  timezone: "Nepal Time (NPT)",
};

// ---------- Session types (colors + legend) ----------
export const sessionTypes = {
  build:    { label: "Build",    color: "#3b5bdb" },
  mentor:   { label: "Mentor",   color: "#2b8a3e" },
  meal:     { label: "Meal",     color: "#e8590c" },
  ceremony: { label: "Ceremony", color: "#c22pp55c" },
  judging:  { label: "Judging",  color: "#e03131" },
  deadline: { label: "Deadline", color: "#e03131" },
  fun:      { label: "Fun",      color: "#0c8599" },
};

type SessionType = keyof typeof sessionTypes;

interface Session {
  time: string;
  type: SessionType;
  title: string;
  note?: string;
}

interface DayPlan {
  title: string;
  theme: string;
  sessions: Session[];
}

// ---------- Day content (in order; one entry per day of the Main Event) ----------
const dayPlans: DayPlan[] = [
  {
    title: "Kickoff & Ideas",
    theme: "Meet your team, pick a problem, and start building.",
    sessions: [
      { time: "09:00", type: "meal",     title: "Registration & breakfast" },
      { time: "10:00", type: "ceremony", title: "Opening ceremony" },
      { time: "10:45", type: "ceremony", title: "Welcome talk & Cognito introduction" },
      { time: "11:30", type: "build",    title: "Team formation" },
      { time: "12:00", type: "meal",     title: "Lunch" },
      { time: "13:00", type: "ceremony", title: "Problem statements revealed" },
      { time: "13:30", type: "build",    title: "Ideation & brainstorming" },
      { time: "15:00", type: "mentor",   title: "Mentor check-in (round 1)" },
      { time: "15:30", type: "build",    title: "Hacking begins" },
      { time: "17:30", type: "meal",     title: "Tea break" },
      { time: "18:00", type: "build",    title: "Hacking" },
      { time: "20:00", type: "meal",     title: "Dinner" },
      { time: "21:00", type: "build",    title: "Night hacking", note: "Optional" },
    ],
  },
  {
    title: "Build & Mentor",
    theme: "Heads down, get unstuck, and take a break when you need one.",
    sessions: [
      { time: "09:00", type: "meal",   title: "Breakfast" },
      { time: "09:30", type: "mentor", title: "Tech workshop", note: "Mentor-led session" },
      { time: "11:00", type: "build",  title: "Hacking" },
      { time: "13:00", type: "meal",   title: "Lunch" },
      { time: "14:00", type: "build",  title: "Hacking" },
      { time: "15:30", type: "mentor", title: "Mentor check-in (round 2)" },
      { time: "16:00", type: "meal",   title: "Snack break" },
      { time: "19:00", type: "meal",   title: "Dinner" },
      { time: "20:00", type: "fun",    title: "Game break", note: "Team activities and games" },
      { time: "21:00", type: "build",  title: "Late-night hacking", note: "Optional" },
    ],
  },
  {
    title: "Submit & Showcase",
    theme: "Finish strong, present your work, and celebrate the winners.",
    sessions: [
      { time: "08:00", type: "meal",     title: "Breakfast" },
      { time: "09:00", type: "build",    title: "Final hacking" },
      { time: "11:00", type: "deadline", title: "Submission deadline", note: "Code freeze" },
      { time: "11:30", type: "judging",  title: "Judging round 1" },
      { time: "13:00", type: "meal",     title: "Lunch" },
      { time: "14:00", type: "judging",  title: "Final pitches", note: "5 minutes per team" },
      { time: "16:00", type: "judging",  title: "Judges' deliberation" },
      { time: "16:30", type: "ceremony", title: "Awards & closing ceremony" },
      { time: "17:30", type: "ceremony", title: "Group photo & wrap-up" },
    ],
  },
];

if (dayCount !== dayPlans.length) {
  throw new Error(
    `Main Event spans ${dayCount} day(s) in the timeline but ${dayPlans.length} day plan(s) are defined`
  );
}

// ---------- Days (dates come from the timeline) ----------
export const scheduleDays = dayPlans.map((plan, i) => {
  const date = new Date(eventStart.getTime() + i * DAY_MS);
  return {
    id: `day-${i + 1}`,
    number: i + 1,
    shortDate: formatUTC(date, { month: "short", day: "numeric" }),
    date: formatUTC(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    title: plan.title,
    theme: plan.theme,
    sessions: plan.sessions,
  };
});

export const footerText = `${eventInfo.title} · Times are in ${eventInfo.timezone}`;

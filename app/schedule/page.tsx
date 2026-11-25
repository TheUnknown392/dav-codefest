"use client";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import "./schedule.css";
import {
  eventInfo,
  sessionTypes,
  scheduleDays,
  footerText,
} from "@/data/schedule";
import {
    isMainEvent,
    todayString
} from "@/data/timeline";

export default function CodefestSchedule() {
    if(!isMainEvent(todayString())) {
        redirect("/");
    }
  return (
    <div className="cf-page">
      <header className="cf-header">
        {eventInfo.logoSrc ? (
          <img className="cf-logo" src={eventInfo.logoSrc} alt={eventInfo.logoText} />
        ) : (
          <div className="cf-logo-text">{eventInfo.logoText}</div>
        )}
        <p className="cf-eyebrow">{eventInfo.eyebrow}</p>
        <h1 className="cf-title">{eventInfo.title}</h1>
        <p className="cf-intro">{eventInfo.intro}</p>
      </header>

      <nav className="cf-day-nav">
        {scheduleDays.map((day) => (
          <a key={day.id} href={`#${day.id}`}>
            Day {day.number} · {day.shortDate}
          </a>
        ))}
      </nav>

      <div className="cf-legend">
        {Object.entries(sessionTypes).map(([key, type]) => (
          <span key={key} className="cf-legend-item" style={{ "--dot": type.color }as CSSProperties}>
            {type.label}
          </span>
        ))}
      </div>

      <main className="cf-main">
        {scheduleDays.map((day) => (
          <section key={day.id} id={day.id} className="cf-day">
            <div className="cf-day-head">
              <span className="cf-day-num">Day {day.number}</span>
              <h2 className="cf-day-title">{day.title}</h2>
              <span className="cf-date">{day.date}</span>
            </div>
            <p className="cf-theme">{day.theme}</p>

            <ul className="cf-schedule">
              {day.sessions.map((s) => {
                const type = sessionTypes[s.type];
                return (
                  <li key={`${s.time}-${s.title}`} className="cf-row">
                    <span className="cf-time">{s.time}</span>
                    <div className="cf-event" style={{ "--dot": type.color } as CSSProperties}>
                      <span className="cf-kind">{type.label}</span>
                      <h3 className="cf-event-title">{s.title}</h3>
                      {s.note && <p className="cf-event-note">{s.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>

      <footer className="cf-footer">{footerText}</footer>
    </div>
  );
}

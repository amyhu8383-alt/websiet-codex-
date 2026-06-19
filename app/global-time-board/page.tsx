"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Badge, Toast } from "@/components/Ui";
import { markets } from "@/lib/data";
import { formatDate, formatTime, getWorkStatus } from "@/lib/time";

type CalendarPriority = "High" | "Medium";

const calendarItems = [
  { dateRange: "2026-06-01 to 2026-11-30", region: "USA / Caribbean", market: "Florida, Texas, Puerto Rico, Jamaica, Bahamas, Dominican Republic", eventName: "Hurricane Season", opportunityType: "Emergency backup and distributor stocking", relatedProducts: "P1000E Plus, P2001E Plus, P5000E Plus, solar panels", action: "Contact distributors and dealers for pre-season stock planning and post-storm replenishment.", priority: "High" as CalendarPriority },
  { dateRange: "2026-07-12 to 2026-08-10", region: "Caribbean", market: "Puerto Rico, Jamaica, Bahamas, Dominican Republic", eventName: "Pre-peak hurricane preparedness window", opportunityType: "Stock preparation before high-risk storm period", relatedProducts: "Portable power stations, solar generators, solar panels", action: "Remind customers to confirm stock, best-selling models, delivery timing and backup power demand.", priority: "High" as CalendarPriority },
  { dateRange: "2026-07-01 to 2026-08-15", region: "Europe", market: "Germany, France, Spain, Poland, Italy", eventName: "Summer outdoor and camping season", opportunityType: "Outdoor portable power station demand", relatedProducts: "P800E, P1000E Plus, P2001E Plus, solar panels", action: "Follow up retailers, distributors and online sellers for summer sell-through and restock opportunities.", priority: "Medium" as CalendarPriority },
  { dateRange: "2026-09-01 to 2026-10-31", region: "Middle East", market: "Kuwait, Saudi Arabia, UAE, Qatar, Oman, Bahrain", eventName: "Solar and backup power demand planning window", opportunityType: "Distributor and project stock planning", relatedProducts: "P2001E Plus, P5000E Plus, BP5000E Pro Max, 12kW inverter system, battery packs", action: "Follow up distributor candidates, solar installers and EPC customers before Q4 procurement.", priority: "High" as CalendarPriority },
  { dateRange: "2026-11-01 to 2026-12-02", region: "USA / Europe / Global", market: "Retail and e-commerce channels", eventName: "Black Friday and Cyber Monday promotion window", opportunityType: "Retail promotion and online sales", relatedProducts: "Portable power stations, solar generators, accessories", action: "Ask online sellers and retail buyers about promotion plans, stock level and target models.", priority: "High" as CalendarPriority },
  { dateRange: "2026-07-01 to 2026-07-31", region: "USA / Online Retail", market: "Amazon / e-commerce sellers", eventName: "Prime Day preparation window", opportunityType: "E-commerce promotion planning", relatedProducts: "P800E, P1000E Plus, P2001E Plus", action: "Contact e-commerce sellers about promo bundles, inventory planning and competitor pricing.", priority: "Medium" as CalendarPriority },
  { dateRange: "2026-12-01 to 2027-02-28", region: "Europe", market: "Germany, Poland, France, Spain, Italy, Ukraine", eventName: "Winter backup power demand", opportunityType: "Home backup and emergency power demand", relatedProducts: "P2001E Plus, P5000E Plus, BP5000E Pro Max, home energy storage products", action: "Follow up distributors and installers for winter backup power planning.", priority: "Medium" as CalendarPriority },
];

export default function GlobalTimeBoard() {
  const [now, setNow] = useState(() => new Date());
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [calendarRegion, setCalendarRegion] = useState("");
  const [calendarPriority, setCalendarPriority] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const items = useMemo(() => markets.map((market) => ({ ...market, status: getWorkStatus(now, market.timeZone) })), [now]);
  const filtered = items.filter((market) => (!region || market.region === region) && (!status || market.status === status));
  const calendarFiltered = calendarItems.filter((item) => (!calendarRegion || item.region.includes(calendarRegion)) && (!calendarPriority || item.priority === calendarPriority));
  const summary = [
    { label: "Best Time Now", count: items.filter((market) => market.status === "Best Time Now").length },
    { label: "Good Time", count: items.filter((market) => market.status === "Good Time").length },
    { label: "Lunch Time", count: items.filter((market) => market.status === "Lunch Time").length },
    { label: "After Hours", count: items.filter((market) => market.status === "After Hours").length },
    { label: "Weekend", count: items.filter((market) => market.status === "Weekend").length },
  ];
  const contactableNow = items.filter((market) => market.status === "Best Time Now" || market.status === "Good Time");

  async function copyMarkets() {
    const text = `Current contactable markets: ${contactableNow.map((market) => `${market.country} - ${market.city}`).join(", ") || "None"}. Recommended action: Send WhatsApp or email follow-up now.`;
    await navigator.clipboard.writeText(text);
    setToast("Contactable markets copied");
  }

  return <main><AppHeader title="Global Time Board" subtitle="Check customer local time, working status and best contact windows across key markets." links={[{ label: "Open Follow-up Assistant", href: "/sales-follow-up-assistant", primary: true }, { label: "Back to Dashboard", href: "/" }]}><div className="header-time"><span>Shenzhen time</span><strong>{formatTime(now, "Asia/Shanghai")}</strong><small>{formatDate(now, "Asia/Shanghai")} · Updated {formatTime(now, "Asia/Shanghai")}</small></div></AppHeader>
    <div className="page-shell compact-page">
      <section className="shenzhen-panel"><div><span className="eyebrow">Reference office time</span><h2>Shenzhen</h2><p>For international sales call and meeting planning.</p></div><strong>{formatTime(now, "Asia/Shanghai")}</strong><div><b>{formatDate(now, "Asia/Shanghai")}</b><span>Asia/Shanghai</span></div><div><b>Suggested working window</b><span>09:00-12:00 · 14:00-18:00</span></div></section>

      <section className="section compact-summary"><div className="section-head"><div><h2>Contact Window Summary</h2><p>Compact view of current contact windows.</p></div></div><div className="summary-chips">{summary.map((item) => <span className="mini-chip" key={item.label}><b>{item.label}:</b> {item.count} {item.count === 1 ? "market" : "markets"}</span>)}</div><p className="contactable-line"><strong>Contactable now:</strong> {contactableNow.length ? contactableNow.map((market) => `${market.country} - ${market.city}`).join(", ") : "No Good Time markets right now."}</p></section>

      <section className="section"><div className="section-head"><div><h2>Global market time</h2><p>{filtered.length} markets shown · Live local time and contact guidance</p></div><span className="live-dot">Live</span></div>
        <div className="quick-actions"><button onClick={() => { setStatus("Best Time Now"); setRegion(""); }}>Show Best Time Now</button>{["Europe", "Middle East", "North America", "Caribbean", "Latin America"].map((value) => <button key={value} onClick={() => { setRegion(value); setStatus(""); }}>{`Show ${value}`}</button>)}<button className="accent" onClick={copyMarkets}>Copy Contactable Markets</button></div>
        <div className="filter-bar time-filters"><label>Region<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="">All regions</option>{[...new Set(markets.map((market) => market.region))].map((value) => <option key={value}>{value}</option>)}</select></label><label>Working status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{["Best Time Now", "Good Time", "Lunch Time", "After Hours", "Weekend", "Not Recommended"].map((value) => <option key={value}>{value}</option>)}</select></label><button className="text-button" onClick={() => { setRegion(""); setStatus(""); }}>Clear filters</button></div>
        <div className="market-grid">{filtered.map((market) => <article className="market-card" key={`${market.country}-${market.city}`}><div className="market-head"><div><strong>{market.city}</strong><span>{market.country} · {market.region}</span></div><Badge kind={market.status}>{market.status}</Badge></div><div className="market-time">{formatTime(now, market.timeZone)}</div><div className="market-meta"><span>{formatDate(now, market.timeZone)}</span><span>{market.timeZone}</span></div><div className="market-action">Action: {market.status === "Best Time Now" ? "Call now" : market.status === "Good Time" ? "Send WhatsApp" : market.status === "Lunch Time" ? "Send email" : market.status === "Weekend" ? "Schedule follow-up" : "Wait until local morning"}</div></article>)}</div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Market Calendar Preview</h2><p>Upcoming market windows for sales follow-up, stock preparation and promotion planning.</p><small className="section-note">Static preview only. Future version will move full market calendar, competitor intelligence, hurricane season tracking, holidays and promotion windows into dedicated dashboards.</small></div></div>
        <div className="filter-bar calendar-filters">
          <label>Region<select value={calendarRegion} onChange={(event) => setCalendarRegion(event.target.value)}><option value="">All regions</option>{["Europe", "Middle East", "Caribbean", "USA", "Online Retail"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Priority<select value={calendarPriority} onChange={(event) => setCalendarPriority(event.target.value)}><option value="">All priorities</option>{["High", "Medium"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <button className="text-button" onClick={() => { setCalendarRegion(""); setCalendarPriority(""); }}>Clear filters</button>
        </div>
        <div className="table-wrap">
          <table className="calendar-table">
            <thead><tr><th>Date Range</th><th>Region</th><th>Market</th><th>Event / Window Name</th><th>Opportunity Type</th><th>Related Products</th><th>Suggested Sales Action</th><th>Priority</th></tr></thead>
            <tbody>{calendarFiltered.map((item) => <tr key={`${item.dateRange}-${item.eventName}`}><td>{item.dateRange}</td><td>{item.region}</td><td>{item.market}</td><td>{item.eventName}</td><td>{item.opportunityType}</td><td>{item.relatedProducts}</td><td>{item.action}</td><td><Badge kind={item.priority}>{item.priority}</Badge></td></tr>)}</tbody>
          </table>
          {calendarFiltered.length === 0 ? <div className="empty">No market windows match the current filter.</div> : null}
        </div>
      </section>
    </div>
    <Toast text={toast} />
  </main>;
}

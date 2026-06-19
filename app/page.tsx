import Link from "next/link";

const tools = [
  { number: "01", title: "Global Time Board", description: "Check customer local time, working status and best contact windows across global markets.", action: "Open Global Time Board", href: "/global-time-board", active: true },
  { number: "02", title: "Personal Sales Follow-up Assistant", description: "Track customer follow-up, deal stage, next action, forecast value, blockers and boss report.", action: "Open Follow-up Assistant", href: "/sales-follow-up-assistant", active: true },
  { number: "03", title: "Customer Prospecting System", description: "Coming soon: find competitor agents, installers, diesel generator customers, retail / OEM buyers, balcony energy storage competitor dealers, inverter + battery pack channels, e-commerce sellers and emergency backup customers.", action: "Coming Soon", href: "/customer-prospecting-system", active: false },
  { number: "04", title: "Competitor Intelligence Board", description: "Coming soon: track competitor products, prices, promotions, Reddit user feedback, market signals and sales opportunities.", action: "Coming Soon", href: "/competitor-intelligence-board", active: false },
  { number: "05", title: "Market Opportunity Calendar", description: "Coming soon: track holidays, buying seasons, Black Friday, Cyber Monday, Prime Day, hurricane season, regional promotion windows and stock preparation timing.", action: "Coming Soon", href: "/market-opportunity-calendar", active: false },
];

export default function Home() {
  return <main className="home-page">
    <header className="home-header"><div className="brand-mark">AB</div><span>Amy B2B Sales Tools</span></header>
    <section className="home-intro"><h1>International Sales<br />Productivity Dashboard</h1><p>Tools for global time checking, customer follow-up planning, and future B2B prospecting workflow.</p></section>
    <section className="tool-grid five-tools">{tools.map(tool => <article className={`tool-card ${tool.active ? "" : "disabled"}`} key={tool.number}><span className="tool-number">{tool.number}</span><div><h2>{tool.title}</h2><p>{tool.description}</p></div>{tool.active ? <Link className="button primary" href={tool.href}>{tool.action} →</Link> : <Link className="button disabled-button" href={tool.href}>{tool.action}</Link>}</article>)}</section>
    <footer className="home-footer">Mock data only · no Gmail, Outlook, Xiaoman CRM, Google Sheets or external systems connected</footer>
  </main>;
}

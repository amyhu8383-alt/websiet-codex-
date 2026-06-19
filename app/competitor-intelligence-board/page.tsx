import { AppHeader } from "@/components/AppHeader";

export default function CompetitorIntelligenceBoardPlaceholder() {
  return <main><AppHeader title="Competitor Intelligence Board" subtitle="Coming soon placeholder for competitor tracking and market signal monitoring." links={[{ label: "Back to Dashboard", href: "/", primary: true }, { label: "Open Global Time Board", href: "/global-time-board" }]} />
    <div className="page-shell">
      <section className="section import-placeholder">
        <h2>Coming Soon</h2>
        <p>Today this route stays as a lightweight placeholder only. Future versions may track competitor products, prices, promotions, Reddit feedback, market signals and sales opportunities.</p>
      </section>
    </div>
  </main>;
}

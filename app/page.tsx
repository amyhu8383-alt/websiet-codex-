import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Boxes, BriefcaseBusiness, Building2, Check,
  ClipboardCheck, Factory, Globe2, Headphones, HousePlug, PackageCheck,
  RadioTower, ShieldCheck, Truck, Users, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/data";
import { metadata as makeMeta } from "@/lib/seo";

export const metadata = makeMeta(
  "Portable Power Station Manufacturer & OEM Supplier | OUKITEL",
  "OUKITEL is a portable power station manufacturer and solar generator supplier for distributors, wholesalers, OEM brands, EPC contractors and global energy partners. Get factory-direct wholesale pricing.",
);

const categories = [
  { title: "Compact Portable Power Stations", range: "512Wh-1024Wh | 800W-1800W", image: "/images/home-products/p1000e-plus-aligned.webp", href: "/portable-power-stations", applications: "Retail, RV, camping, mobile work and short-term home backup" },
  { title: "Professional Portable Power Stations", range: "2048Wh-5120Wh | 2400W-3600W", image: "/images/home-products/p2001e-pro-aligned.webp", href: "/portable-power-stations", applications: "Home backup, construction, field work and emergency response" },
  { title: "Heavy-duty Energy Storage", range: "5120Wh+ | 5000W-6000W", image: "/images/home-products/p5000e-pro-aligned.webp", href: "/products", applications: "High-load backup, off-grid solar, projects and professional channels" },
];

const cooperation: Array<[LucideIcon, string, string]> = [
  [Users, "Distributor program", "Portfolio planning and regional channel cooperation for qualified portable power station distributors."],
  [Boxes, "Wholesale pricing", "Factory-direct volume quotations based on model mix, quantity and destination market."],
  [Wrench, "OEM/ODM service", "Custom portable power station branding, packaging, documentation and product development support."],
  [BriefcaseBusiness, "Marketing support", "Product assets, campaign materials and market-ready selling points for channel launches."],
  [Headphones, "After-sales service", "Model and region-specific warranty, repair and technical communication support."],
  [Truck, "Reliable supply chain", "Structured production planning, order coordination and selected-market inventory resources."],
  [Globe2, "Long-term partnership", "A scalable cooperation model for brands, wholesalers, solar dealers and EPC partners."],
];

const quality: Array<[LucideIcon, string, string]> = [
  [BadgeCheck, "Certifications", "CE, FCC, MSDS, UN38.3, UL and PSE availability confirmed by model and market."],
  [ClipboardCheck, "Aging test", "Finished units undergo controlled aging procedures before shipment approval."],
  [Check, "ATS Test", "Automatic transfer switching is tested for reliable backup power response and consistent operation."],
  [ShieldCheck, "Battery safety", "LiFePO4 cells, BMS protection and safety checks support long-cycle operation."],
  [Factory, "Production capacity", "30,000+ m2 manufacturing footprint and an experienced production organization."],
  [PackageCheck, "Strict quality control", "Incoming, in-process and finished-product checkpoints reduce delivery risk."],
  [RadioTower, "Product traceability", "Production and inspection records support model and batch-level accountability."],
  [Building2, "Final inspection", "Appearance, function, accessories and packaging are reviewed before release."],
];

const solutions: Array<[string, string, string, string]> = [
  ["RV & Outdoor", "Portable power station for RV travel, outdoor retail and mobile living.", "/applications#rv-outdoor", "/images/home-products/p1000e-plus-aligned.webp"],
  ["Home Backup", "Solar generator for home backup, refrigerators, Wi-Fi and essential appliances.", "/applications#home-backup", "/images/home-products/p2001e-plus-aligned.webp"],
  ["Construction Sites", "High-output mobile power for tools, temporary worksites and contractors.", "/applications#construction", "/images/home-products/p2001e-pro-aligned.webp"],
  ["Off-grid Solar Storage", "LiFePO4 storage for solar installers, remote properties and energy projects.", "/applications#off-grid", "/images/home-products/ep2500-aligned.webp"],
  ["Telecom & Field Work", "Reliable power for communications, inspection teams and remote operations.", "/applications#telecom", "/images/home-products/bp2000e-pro-aligned.webp"],
  ["Emergency & Disaster Backup", "Emergency backup power stations for outages, storms and response teams.", "/applications#emergency", "/images/home-products/p5000e-pro-aligned.webp"],
];

export default function Home() {
  return <main>
    <section className="hero banner-hero dark">
      <Image className="banner-bg" src="/images/banner/oukitel-b2b-banner.png" alt="" fill priority sizes="100vw" />
      <div className="banner-overlay" aria-hidden="true" />
      <div className="container banner-hero-content">
        <div className="banner-copy">
          <h1 className="display">Portable Power Station Manufacturer for Global Distributors &amp; OEM Brands</h1>
          <p className="lede">Factory-direct LiFePO4 portable power stations, solar generators and OEM/ODM energy storage solutions for distributors, wholesalers, brands, contractors and EPC partners worldwide.</p>
          <div className="actions"><Link className="btn btn-primary" href="#inquiry">Get Wholesale Quote <ArrowRight size={18}/></Link><Link className="btn btn-outline" href="/products">View Product Range</Link></div>
          <div className="hero-proof"><span><Check size={16}/> Factory-direct supply</span><span><Check size={16}/> OEM/ODM available</span><span><Check size={16}/> Global B2B support</span></div>
        </div>
      </div>
    </section>

    <div className="container stats"><div className="stat"><strong>2000</strong><span>Company founded</span></div><div className="stat"><strong>30,000+ m2</strong><span>Manufacturing footprint</span></div><div className="stat"><strong>400+</strong><span>Team members</span></div><div className="stat"><strong>60+ markets</strong><span>Global business experience</span></div></div>

    <section className="manufacturer-intro"><div className="container manufacturer-intro-grid"><h2>A Global Solar Generator Manufacturer and Portable Power Station Supplier</h2><p>OUKITEL supports wholesale solar generator programs and custom portable power station projects for professional buyers. Whether your market needs a solar generator for home backup, a portable power station for RV channels or high-output emergency systems, our team can recommend the right product and cooperation model.</p></div></section>

    <section className="section" id="product-categories"><div className="container"><span className="eyebrow">Portable power station supplier</span><h2 className="title">Portable Power Station Product Categories</h2><p className="body section-intro">Source a complete LiFePO4 portable power station range from compact retail models to heavy-duty energy storage. Every category supports bulk orders and OEM/ODM cooperation.</p><div className="category-grid">{categories.map(c => <article className="category-card" key={c.title}><div className="category-media"><Image src={c.image} alt={`${c.title} supplied by OUKITEL`} width={1200} height={1200} sizes="(max-width: 900px) 100vw, 33vw"/></div><div className="category-copy"><p className="range">{c.range}</p><h3>{c.title}</h3><ul><li>LiFePO4 battery</li><li>OEM/ODM available</li><li>Bulk order support</li><li>{c.applications}</li></ul><Link className="btn btn-dark" href={c.href}>View Products <ArrowRight size={17}/></Link></div></article>)}</div></div></section>

    <section className="section cooperation-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">B2B cooperation</span><h2 className="title">Wholesale, Distributor &amp; OEM Cooperation</h2></div><p className="body">OUKITEL works with portable power station wholesalers, energy brands, solar equipment dealers, e-commerce sellers and project partners that need dependable products and long-term supply.</p></div><div className="cooperation-grid">{cooperation.map(([Icon,title,text]) => <article className="cooperation-item" key={String(title)}><div className="iconbox"><Icon/></div><div><h3>{String(title)}</h3><p>{String(text)}</p></div></article>)}</div><div className="actions"><Link className="btn btn-primary" href="/distributor-program">Join Distributor Program</Link><Link className="btn btn-light" href="/oem-portable-power-station">Discuss OEM/ODM Project</Link></div></div></section>

    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Factory & quality control</span><h2 className="title">Manufacturing Quality Global Buyers Can Verify</h2></div><p className="body">As a portable power station manufacturer, OUKITEL combines structured production, electrical testing and final inspection to support consistent wholesale and OEM deliveries.</p></div><div className="quality-grid">{quality.map(([Icon,title,text]) => <article className="quality-item" key={String(title)}><Icon/><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div><div className="actions"><Link className="btn btn-dark" href="/factory">Explore Factory &amp; Quality</Link></div></div></section>

    <section className="section soft"><div className="container"><span className="eyebrow">Application solutions</span><h2 className="title">Portable Energy Solutions for Professional Markets</h2><p className="body section-intro">Choose the right solar generator and emergency backup power station by application, load requirement and sales channel.</p><div className="solution-grid">{solutions.map(([title,text,href,image]) => <Link className="solution-card" href={href} key={title}><div className="solution-media"><Image src={image} alt={`${title} portable power station solution`} width={1200} height={1200} sizes="(max-width: 700px) 100vw, 33vw"/></div><div><h3>{title}</h3><p>{text}</p><span>Explore solution <ArrowRight size={16}/></span></div></Link>)}</div></div></section>

    <section className="section dark"><div className="container split"><div><span className="eyebrow">OEM portable power station</span><h2 className="title">Create a Custom Portable Power Station for Your Brand</h2><p className="lede">From product platform and industrial design to packaging, certification planning and mass production, our OEM/ODM team helps energy brands launch market-ready products.</p><div className="actions"><Link className="btn btn-primary" href="/oem-portable-power-station">Start an OEM Project</Link></div></div><div className="process">{[["01","Requirement review"],["02","Product & compliance"],["03","Sample validation"],["04","Mass production"]].map(x => <div className="step" key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>Clear checkpoints for scope, quality and delivery.</p></div>)}</div></div></section>

    <section className="section" id="inquiry"><div className="container inquiry-layout"><div><span className="eyebrow">Get wholesale pricing</span><h2 className="title">Tell Us About Your Business Requirement</h2><p className="body">Receive a product recommendation and B2B quotation based on your market, business type and estimated order quantity.</p><div className="inquiry-benefits"><span><Check/> Direct factory communication</span><span><Check/> Model and capacity recommendation</span><span><Check/> Wholesale or OEM quotation</span><span><Check/> Market-specific documentation review</span></div><div className="faq">{faqs.slice(0,3).map(f => <details key={f.q}><summary>{f.q}</summary><p className="body">{f.a}</p></details>)}</div></div><InquiryForm/></div></section>

    <JsonLd data={{"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}}/>
  </main>;
}

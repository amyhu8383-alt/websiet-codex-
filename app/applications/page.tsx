import Link from "next/link";
import { ArrowRight, Building, HardHat, HousePlug, RadioTower, ShieldPlus, SunMedium } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { metadata as makeMeta } from "@/lib/seo";

export const metadata = makeMeta(
  "Portable Power Station Applications | Home, RV, Solar & Emergency",
  "Explore OUKITEL portable power station solutions for RV, home backup, construction, off-grid solar, telecom field work and emergency response.",
  "/applications",
);

const items: Array<[string, string, string, LucideIcon]> = [
  ["rv-outdoor", "Portable Power Station for RV & Outdoor", "Power refrigerators, lighting, laptops, cameras and mobile equipment for RV dealers and outdoor retail channels.", HousePlug],
  ["home-backup", "Solar Generator for Home Backup", "Support refrigerators, Wi-Fi, lighting and essential appliances during outages with scalable LiFePO4 backup power.", Building],
  ["construction", "Portable Power for Construction Sites", "Provide quiet mobile energy for tools, temporary worksites, inspection equipment and contractor operations.", HardHat],
  ["off-grid", "Off-grid Solar Energy Storage", "Combine portable power stations and solar charging for remote properties, solar installers and distributed energy projects.", SunMedium],
  ["telecom", "Telecom & Field Work Power", "Maintain communications, monitoring and field equipment where stable grid access is unavailable.", RadioTower],
  ["emergency", "Emergency Backup Power Station", "Prepare response teams, institutions and regional distributors for storms, outages and disaster recovery demand.", ShieldPlus],
];

export default function ApplicationsPage() {
  return <main><section className="subhero"><div className="container"><div className="breadcrumbs">Home / Applications</div><h1 className="display">Portable Power Solutions by Application</h1><p className="lede">Match output, capacity and charging performance to the needs of your customers, projects and sales channels.</p></div></section><section className="section"><div className="container application-list">{items.map(([id,title,text,Icon]) => <article className="application-row" id={String(id)} key={String(id)}><div className="application-icon"><Icon/></div><div><h2>{String(title)}</h2><p>{String(text)}</p></div><Link className="btn btn-dark" href="/contact">Request Solution <ArrowRight size={17}/></Link></article>)}</div></section></main>;
}

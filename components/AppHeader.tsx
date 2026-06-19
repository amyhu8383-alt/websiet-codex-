import Link from "next/link";

export function AppHeader({ title, subtitle, children, links }: { title:string; subtitle:string; children?:React.ReactNode; links:{label:string;href:string;primary?:boolean}[] }) {
  return <header className="app-header"><div className="app-title"><h1>{title}</h1><p>{subtitle}</p></div>{children}<nav className="header-actions">{links.map((link) => <Link key={link.href} className={link.primary ? "button primary" : "button dark-button"} href={link.href}>{link.label}</Link>)}</nav></header>;
}

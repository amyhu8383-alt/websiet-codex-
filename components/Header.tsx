"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { content, isLocale, type Locale } from "@/lib/i18n";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale: Locale = isLocale(firstSegment) ? firstSegment : "en";
  const localized = isLocale(firstSegment);
  const localizedHome = localized && pathname === `/${locale}`;
  const copy = content[locale];
  const homeHref = localized ? `/${locale}` : "/";
  const contactHref = localized ? `/${locale}/contact` : "/contact";
  const quoteHref = localized ? `/${locale}/contact#inquiry` : "/#inquiry";
  const links = [[copy.nav.products,"/products"],[copy.nav.solutions,"/applications"],[copy.nav.wholesale,"/portable-power-station-wholesale"],[copy.nav.oem,"/oem-portable-power-station"],[copy.nav.factory,"/factory"],[copy.nav.resources,"/resources"],[copy.nav.about,"/about"],[copy.nav.contact,contactHref]];
  const headerClass = `header${scrolled ? " scrolled" : ""}${open ? " menu-open" : ""}${localizedHome ? " localized-banner-header" : ""}`;

  return <header className={headerClass} dir={copy.dir}><div className="container nav"><Link href={homeHref} className="logo">OUK<span style={{color:"white"}}>I</span>T<i>E</i>L</Link><nav className="nav-links">{links.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav><LanguageSwitcher currentLocale={locale}/><Link className="btn btn-primary nav-cta" href={quoteHref}>{copy.nav.quote}</Link><button className="mobile-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close menu":"Open menu"}>{open?<X/>:<Menu/>}</button></div>{open?<nav className="mobile-menu" id="mobile-navigation">{links.map(([label,href])=><Link href={href} onClick={()=>setOpen(false)} key={href}>{label}</Link>)}<LanguageSwitcher currentLocale={locale}/><Link className="btn btn-primary" href={quoteHref} onClick={()=>setOpen(false)}>{copy.nav.quote}</Link></nav>:null}</header>;
}

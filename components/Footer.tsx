"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { content, isLocale } from "@/lib/i18n";

const seoLinks = [
  ["Portable Power Station Manufacturer", "/"], ["Solar Generator Supplier", "/solar-generators"],
  ["Wholesale Portable Power Station", "/portable-power-station-wholesale"], ["OEM Portable Power Station", "/oem-portable-power-station"],
  ["LiFePO4 Power Station", "/portable-power-stations"], ["Home Backup Power Station", "/applications#home-backup"],
  ["RV Portable Power Station", "/applications#rv-outdoor"], ["Emergency Solar Generator", "/applications#emergency"],
  ["Portable Power Station Distributor", "/distributor-program"], ["Solar Generator Wholesale", "/solar-generators"],
];

export function Footer() {
  const pathname=usePathname();
  const segment=pathname.split("/").filter(Boolean)[0];
  const localized=isLocale(segment);
  const c=content[localized?segment:"en"];
  const contactHref=localized?`/${segment}/contact`:"/contact";
  return <footer className="footer" dir={c.dir}><div className="container footer-grid"><div><div className="logo">OUKITEL</div><p>{c.hero.subtitle}</p><p>amy@oukitelpower.com</p><p className="footer-address">Shenzhen Office<br/>26th Floor, Building C, Digital Innovation Center, Minzhi Avenue, Longhua District, Shenzhen, Guangdong, China</p></div><div><h4>{c.nav.products} &amp; {c.nav.solutions}</h4>{localized?c.products.cards.map((item,index)=><Link href={index===1?"/solar-generators":"/products"} key={item.title}>{item.title}</Link>):seoLinks.slice(0,5).map(([label,href])=><Link href={href} key={label}>{label}</Link>)}</div><div><h4>{c.cooperation.eyebrow}</h4>{localized?c.cooperation.cards.map(item=><Link href="/portable-power-station-wholesale" key={item.title}>{item.title}</Link>):seoLinks.slice(5).map(([label,href])=><Link href={href} key={label}>{label}</Link>)}</div><div><h4>OUKITEL</h4><Link href="/factory">{c.nav.factory}</Link><Link href="/about">{c.nav.about}</Link><Link href="/resources">{c.nav.resources}</Link><Link href={contactHref}>{c.nav.contact}</Link></div></div><div className="container footer-bottom">© 2026 Shenzhen Yunji New Energy Technology Co., Ltd.</div></footer>;
}

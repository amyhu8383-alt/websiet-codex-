import Image from "next/image";
import { Building2, Factory, Mail } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { LocationMap } from "@/components/LocationMap";
import { content, type Locale } from "@/lib/i18n";

const officeAddress="26th Floor, Building C, Digital Innovation Center, Minzhi Avenue, Longhua District, Shenzhen, Guangdong, China";
const factoryAddress="4th Floor, Building 7, Hengang Technology Industrial Park, Huiyang District, Huizhou City, Guangdong Province, China";

export function LocalizedContact({ locale }: { locale: Locale }) {
  const c=content[locale];
  return <main className="localized-page localized-contact" lang={locale} dir={c.dir}>
    <section className="localized-contact-hero"><Image src={c.images.contactBackgroundImage} alt="OUKITEL global B2B sales and manufacturing" fill priority sizes="100vw"/><div/><div className="container"><span className="eyebrow">OUKITEL GLOBAL B2B</span><h1>{c.contact.heroTitle}</h1><p>{c.contact.heroText}</p></div></section>
    <section className="section"><div className="container localized-grid three contact-notes"><article><h2>{c.contact.leadTitle}</h2><p>{c.contact.leadText}</p></article><article><h2>OEM/ODM</h2><p>{c.contact.oemNote}</p></article><article><h2>B2B</h2><p>{c.contact.distributorNote}<br/>{c.contact.bulkNote}</p></article></div></section>
    <section className="section soft" id="inquiry"><div className="container localized-contact-grid"><div className="localized-contact-details"><span className="eyebrow">OUKITEL</span><h2>{c.contact.leadTitle}</h2><div className="contact-detail"><Mail/><div><b>Email</b><a href="mailto:amy@oukitelpower.com">amy@oukitelpower.com</a></div></div><div className="contact-detail"><Building2/><div><b>{c.contact.officeLabel}</b><p>{officeAddress}</p></div></div><div className="contact-detail"><Factory/><div><b>{c.contact.factoryLabel}</b><p>{factoryAddress}</p></div></div></div><InquiryForm copy={c.contact.form} extended/></div></section>
    <section className="section"><div className="container"><span className="eyebrow">OPENSTREETMAP</span><h2 className="title">{c.contact.locationsTitle}</h2><div className="location-grid"><LocationMap title="OUKITEL Shenzhen Office" label={c.contact.officeLabel} address={officeAddress} coordinates={{lat:22.62,lon:114.04}} bbox={[114.00,22.59,114.08,22.65]}/><LocationMap title="OUKITEL Huizhou Factory" label={c.contact.factoryLabel} address={factoryAddress} coordinates={{lat:22.79,lon:114.46}} bbox={[114.42,22.76,114.50,22.82]}/></div></div></section>
  </main>;
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Factory, Globe2, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { content, type Locale } from "@/lib/i18n";

export function LocalizedHome({ locale }: { locale: Locale }) {
  const c = content[locale];
  const contact = `/${locale}/contact`;
  const faqSchema = {"@context":"https://schema.org","@type":"FAQPage",mainEntity:c.faq.items.map(item=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))};
  return <main className="localized-page" lang={locale} dir={c.dir}>
    <JsonLd data={faqSchema}/>
    <section className="localized-hero-image">
      <Image src={c.images.heroImage} alt={`${c.hero.title} - OUKITEL B2B`} width={1672} height={941} priority sizes="100vw"/>
      <HeroHotspots locale={locale}/>
      <div className="hero-language-control"><LanguageSwitcher currentLocale={locale}/></div>
    </section>
    <section className="localized-proof"><div className="container localized-grid three">{c.proof.map((item,index)=><article key={item.title}><span>{index===0?<Factory/>:index===1?<ShieldCheck/>:<Globe2/>}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></section>
    <LocalizedCards eyebrow={c.products.eyebrow} title={c.products.title} intro={c.products.intro} cards={c.products.cards} images={c.images.productImages} href="/products"/>
    <LocalizedCards eyebrow={c.applications.eyebrow} title={c.applications.title} intro={c.applications.intro} cards={c.applications.cards} images={c.images.applicationImages} href="/applications" soft/>
    <section className="section localized-cooperation"><div className="container"><span className="eyebrow">{c.cooperation.eyebrow}</span><h2 className="title">{c.cooperation.title}</h2><p className="body localized-intro">{c.cooperation.intro}</p><div className="localized-grid three">{c.cooperation.cards.map(item=><article className="localized-text-card" key={item.title}><Check/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
    <section className="localized-oem"><div className="container localized-split"><div><span className="eyebrow">OEM / ODM</span><h2>{c.oem.title}</h2><p>{c.oem.text}</p><Link className="btn btn-primary" href={contact}>{c.oem.cta}<ArrowRight size={18}/></Link></div><div className="localized-oem-image"><Image src={c.images.b2bCooperationImage} alt="OUKITEL OEM ODM portable power station cooperation" fill sizes="(max-width: 800px) 100vw, 45vw"/></div></div></section>
    <section className="section soft"><div className="container localized-grid two"><InfoPanel title={c.quality.title} text={c.quality.text} items={c.quality.items}/><InfoPanel title={c.support.title} text={c.support.text} items={c.support.items}/></div></section>
    <section className="section"><div className="container localized-faq"><span className="eyebrow">FAQ</span><h2 className="title">{c.faq.title}</h2>{c.faq.items.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></section>
    <section className="localized-final"><div className="container"><h2>{c.contact.heroTitle}</h2><p>{c.contact.heroText}</p><Link className="btn btn-primary" href={contact}>{c.nav.quote}<ArrowRight size={18}/></Link></div></section>
  </main>;
}

const ltrHotspots=[
  {key:"products",href:"/products",style:{left:"18.4%",top:"2.4%",width:"9.4%",height:"6%"}},
  {key:"solutions",href:"/applications",style:{left:"28%",top:"2.4%",width:"9.2%",height:"6%"}},
  {key:"oem",href:"/oem-portable-power-station",style:{left:"37.3%",top:"2.4%",width:"9.5%",height:"6%"}},
  {key:"about",href:"/about",style:{left:"46.8%",top:"2.4%",width:"8.2%",height:"6%"}},
  {key:"contact",href:"contact",style:{left:"55%",top:"2.4%",width:"7.7%",height:"6%"}},
  {key:"quote",href:"contact#inquiry",style:{left:"82.8%",top:"2%",width:"14.8%",height:"6.3%"}},
  {key:"partner",href:"contact#inquiry",style:{left:"2.8%",top:"49.8%",width:"17.5%",height:"7.5%"}},
  {key:"explore",href:"/products",style:{left:"20.8%",top:"49.8%",width:"18.3%",height:"7.5%"}},
] as const;

const rtlHotspots=[
  {key:"contact",href:"contact",style:{left:"18.8%",top:"2.4%",width:"9.5%",height:"6%"}},
  {key:"about",href:"/about",style:{left:"28.6%",top:"2.4%",width:"8.6%",height:"6%"}},
  {key:"oem",href:"/oem-portable-power-station",style:{left:"37.4%",top:"2.4%",width:"9.5%",height:"6%"}},
  {key:"solutions",href:"/applications",style:{left:"47%",top:"2.4%",width:"9.2%",height:"6%"}},
  {key:"products",href:"/products",style:{left:"56.4%",top:"2.4%",width:"9.2%",height:"6%"}},
  {key:"quote",href:"contact#inquiry",style:{left:"84.5%",top:"2%",width:"13%",height:"6.3%"}},
  {key:"partner",href:"contact#inquiry",style:{left:"3%",top:"49.8%",width:"17.5%",height:"7.5%"}},
  {key:"explore",href:"/products",style:{left:"21.5%",top:"49.8%",width:"17%",height:"7.5%"}},
] as const;

function HeroHotspots({locale}:{locale:Locale}){
  const c=content[locale];
  const labels:Record<string,string>={products:c.nav.products,solutions:c.nav.solutions,oem:c.nav.oem,about:c.nav.about,contact:c.nav.contact,quote:c.nav.quote,partner:c.hero.primary,explore:c.hero.secondary};
  return <nav className="hero-hotspots" aria-label={`${c.hero.title} navigation`}>{(locale==="ar"?rtlHotspots:ltrHotspots).map(item=>{
    const href=item.href.startsWith("contact")?`/${locale}/${item.href}`:item.href;
    return <Link key={item.key} className={`hero-hotspot hotspot-${item.key}`} href={href} style={item.style} aria-label={labels[item.key]}><span>{labels[item.key]}</span></Link>;
  })}</nav>;
}

function LocalizedCards({eyebrow,title,intro,cards,images,href,soft=false}:{eyebrow:string;title:string;intro:string;cards:{title:string;text:string}[];images:string[];href:string;soft?:boolean}) {
  return <section className={`section localized-cards${soft?" soft":""}`}><div className="container"><span className="eyebrow">{eyebrow}</span><h2 className="title">{title}</h2><p className="body localized-intro">{intro}</p><div className="localized-grid three">{cards.map((card,index)=><Link href={href} className="localized-image-card" key={card.title}><div><Image src={images[index]||images[0]} alt={card.title} fill sizes="(max-width: 800px) 100vw, 33vw"/></div><h3>{card.title}</h3><p>{card.text}</p><span className="card-link"><ArrowRight size={18}/></span></Link>)}</div></div></section>;
}

function InfoPanel({title,text,items}:{title:string;text:string;items:string[]}) {return <article className="localized-info"><h2>{title}</h2><p>{text}</p><ul>{items.map(item=><li key={item}><Check size={18}/>{item}</li>)}</ul></article>}

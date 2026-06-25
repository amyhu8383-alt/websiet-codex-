import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedContact } from "@/components/LocalizedContact";
import { content, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams(){return locales.map(locale=>({locale}));}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return{};const c=content[locale];return{title:c.contact.seoTitle,description:c.contact.seoDescription,alternates:{canonical:`/${locale}/contact`,languages:Object.fromEntries([...locales.map(code=>[code,`/${code}/contact`]),["x-default","/en/contact"]])},openGraph:{title:c.contact.seoTitle,description:c.contact.seoDescription,url:`/${locale}/contact`,images:[c.images.contactHeroImage],locale}}}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <LocalizedContact locale={locale}/>;}

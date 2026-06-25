import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedHome } from "@/components/LocalizedHome";
import { content, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams(){return locales.map(locale=>({locale}));}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return{};const c=content[locale];return{title:c.seo.title,description:c.seo.description,keywords:c.seo.keywords,alternates:{canonical:`/${locale}`,languages:Object.fromEntries([...locales.map(code=>[code,`/${code}`]),["x-default","/en"]])},openGraph:{title:c.seo.ogTitle,description:c.seo.ogDescription,url:`/${locale}`,images:[c.images.heroImage],locale}}}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <LocalizedHome locale={locale}/>;}

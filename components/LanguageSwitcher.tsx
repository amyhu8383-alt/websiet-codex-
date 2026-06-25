"use client";

import Link from "next/link";
import { Check, ChevronDown, Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { content, localeNames, locales, type Locale } from "@/lib/i18n";

function localePath(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  const isContact = parts.at(-1) === "contact";
  return `/${locale}${isContact ? "/contact" : ""}`;
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="language-switcher">
    <button type="button" className="language-button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Change language">
      <Languages size={17}/><span>{content[currentLocale].name}</span><ChevronDown size={15}/>
    </button>
    {open ? <div className="language-menu">
      {locales.map(locale => <Link key={locale} href={localePath(pathname, locale)} hrefLang={locale} onClick={() => setOpen(false)}>
        <span>{localeNames[locale]}</span>{locale === currentLocale ? <Check size={15}/> : null}
      </Link>)}
    </div> : null}
  </div>;
}

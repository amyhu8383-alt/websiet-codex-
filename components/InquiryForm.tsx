"use client";
import { useState } from "react";
import type { FormCopy } from "@/lib/i18n";

const defaultCopy: FormCopy = {title:"Request a B2B Quote",intro:"Tell us how we can support your energy business.",name:"Name",email:"Email",phone:"Phone",company:"Company Name",country:"Country / Region",businessType:"Business Type",product:"Product Requirement",quantity:"Estimated Quantity",message:"Message",consent:"I agree that OUKITEL may use these details to respond to my business inquiry.",submit:"Submit Inquiry",sending:"Sending...",success:"Thank you. The OUKITEL B2B sales team will contact you shortly.",error:"Unable to send. Please email amy@oukitelpower.com.",selectType:"Select business type",selectQuantity:"Select quantity",types:[],quantities:[]};

export function InquiryForm({ product = "", copy = defaultCopy, extended = false }: { product?: string; copy?: FormCopy; extended?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    if (!formElement.reportValidity()) return;
    setState("sending");
    const form = new FormData(formElement);
    const res = await fetch("/api/inquiry", { method: "POST", body: JSON.stringify(Object.fromEntries(form)), headers: { "content-type": "application/json" } });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") return <div className="notice">{copy.success}</div>;

  return <form className="quote" onSubmit={submit}><h2>{copy.title}</h2><p className="body">{copy.intro}</p><div className="form-grid"><div className="field"><label>{copy.name} *</label><input name="name" autoComplete="name" required/></div><div className="field"><label>{copy.email} *</label><input name="email" type="email" autoComplete="email" dir="ltr" required/></div><div className="field"><label>{copy.phone} *</label><input name="phone" type="tel" autoComplete="tel" inputMode="tel" dir="ltr" pattern="^\+?[0-9][0-9\s().-]{6,19}$" title="Enter an international phone number, for example +86 159 1234 5678" placeholder="+86 159 1234 5678" required/></div><div className="field"><label>{copy.company}</label><input name="company" autoComplete="organization"/></div><div className="field"><label>{copy.country}</label><input name="country" autoComplete="country-name"/></div>{extended?<><div className="field"><label>{copy.businessType}</label><select name="businessType" defaultValue=""><option value="">{copy.selectType}</option>{copy.types.map(value=><option key={value}>{value}</option>)}</select></div></>:null}<div className="field"><label>{copy.product}</label><input name="product" defaultValue={product} placeholder="Model, capacity or application"/></div>{extended?<div className="field"><label>{copy.quantity}</label><select name="quantity" defaultValue=""><option value="">{copy.selectQuantity}</option>{copy.quantities.map(value=><option key={value}>{value}</option>)}</select></div>:null}<div className="field full"><label>{copy.message}</label><textarea name="message" placeholder="Tell us about your market, application or project requirement."/></div><div className="field full"><label className="fine"><input type="checkbox" required style={{width:"auto",marginInlineEnd:8}}/>{copy.consent}</label><input name="website" tabIndex={-1} autoComplete="off" style={{display:"none"}}/></div></div><button className="btn btn-primary form-submit" disabled={state === "sending"}>{state === "sending" ? copy.sending : copy.submit}</button>{state === "error" ? <p className="form-error">{copy.error}</p> : null}</form>;
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const recent = new Map<string, number>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s().-]{6,19}$/;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (data.website) return NextResponse.json({ ok: true });
    if (!data.name || !emailPattern.test(data.email || "") || !phonePattern.test(data.phone || "")) return NextResponse.json({ error: "Please provide a valid name, email and phone number." }, { status: 400 });
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    const now = Date.now();
    if (now - (recent.get(ip) || 0) < 15000) return NextResponse.json({ error: "Please wait before submitting again" }, { status: 429 });
    recent.set(ip, now);
    const subject = `OUKITEL B2B inquiry: ${data.company || data.name}${data.country ? ` / ${data.country}` : ""}`;
    const text = Object.entries(data).filter(([key]) => key !== "website").map(([key,value]) => `${key}: ${value}`).join("\n");
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      await transporter.sendMail({ from: process.env.SMTP_USER, to: process.env.LEAD_TO_EMAIL || "amy@oukitelpower.com", replyTo: data.email, subject, text });
    } else console.info(subject, text);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to process inquiry" }, { status: 500 });
  }
}

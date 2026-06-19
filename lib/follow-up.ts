import type { CurrentStage, FollowUpRecord, Priority, ReplyStatus } from "./types";

export function daysSince(date: string, now = new Date()) {
  return Math.floor((now.getTime() - new Date(`${date}T00:00:00`).getTime()) / 86400000);
}

export function getPriority(record: FollowUpRecord): Priority {
  const today = new Date().toISOString().slice(0, 10);
  const criticalUrgency =
    (!!record.nextFollowUpDate && record.nextFollowUpDate <= today) ||
    record.followUpRhythm === "Daily" ||
    record.strategicCustomer === "Yes" ||
    record.bossDecisionNeeded === "Yes";

  if (
    criticalUrgency ||
    record.leadTemperature === "Hot" ||
    ["Quotation Sent", "Negotiation", "Meeting Scheduled", "Payment Pending"].includes(record.currentStage) ||
    record.replyStatus === "Need Price" ||
    record.probability >= 60 ||
    record.customerValueTier === "A"
  ) return "High";
  if (
    record.leadTemperature === "Warm" ||
    record.currentStage === "Product Catalog Sent" ||
    (record.currentStage === "Waiting Reply" && daysSince(record.lastContactDate) <= 7) ||
    (record.probability >= 30 && record.probability <= 50) ||
    record.followUpRhythm === "Every 2-3 Days" ||
    record.followUpRhythm === "Weekly" ||
    record.customerValueTier === "B"
  ) return "Medium";
  return "Low";
}

const stageSuggestions: Partial<Record<CurrentStage, [string, string]>> = {
  "New Lead": ["Send a short introduction email with product catalog.", "2 business days later"],
  "First Contact Sent": ["Send a polite follow-up email or WhatsApp message.", "3 business days later"],
  "Product Catalog Sent": ["Ask which models they prefer and whether they buy in bulk, distribute locally, sell online, or need OEM branding.", "3 business days later"],
  "Quotation Sent": ["Follow up quotation and ask for target price, order quantity and delivery time.", "2 business days later"],
  "Sample Discussion": ["Confirm sample model, shipping address, plug type and payment method.", "2 business days later"],
  "Negotiation": ["Clarify price, MOQ, delivery time, warranty, market plan and decision timeline.", "1-2 business days later"],
  "Meeting Scheduled": ["Prepare meeting agenda, product comparison, price points and customer questions.", "On meeting date"],
  "Factory Visit Done": ["Send follow-up summary, confirm selected models, quantity plan and next decision timeline.", "2 business days later"],
  "Payment Pending": ["Confirm payment schedule, remind customer of stock / production lead time and ask if they need PI update.", "1-2 business days later"],
  "Waiting Reply": ["Send a value-based follow-up with a product, stock or market opportunity angle.", "5 business days later"],
  "Dormant": ["Send reactivation email with a new product update or seasonal market opportunity.", "14 business days later"],
};

const replySuggestions: Partial<Record<ReplyStatus, string>> = {
  "Need Price": "Prepare quotation and ask for quantity, plug type, target market and delivery requirement.",
  "Need Catalog": "Send the latest catalog and ask which OUKITEL models they are interested in.",
  "Need Meeting": "Suggest 2-3 meeting options based on the customer's local time.",
  "Need Samples": "Confirm sample model, address, plug type and payment method.",
  "Need OEM Details": "Send OEM/ODM options, MOQ, branding, packaging and certification details.",
  "Need Distributor Terms": "Send distributor terms, territory expectations, margin range and support policy.",
  "Need Stock Information": "Send stock update and confirm delivery urgency.",
  "Need Technical Confirmation": "Collect technical questions and prepare engineer confirmation.",
};

export function getSuggestion(record: FollowUpRecord) {
  let action = replySuggestions[record.replyStatus] ?? stageSuggestions[record.currentStage]?.[0] ?? record.nextAction;
  let timing = stageSuggestions[record.currentStage]?.[1] ?? "3 business days later";
  if (["Price not confirmed", "Target price gap"].includes(record.mainBlocker)) {
    action = "Clarify target price, annual volume, channel margin and competitor benchmark.";
  }
  if (record.strategicCustomer === "Yes" && !record.nextFollowUpDate) {
    timing = "Set a next follow-up date now";
  }
  if (record.needBossSupport === "Yes") {
    action = `${action} Prepare a short internal summary for boss decision.`;
  }
  if (record.paymentStatus === "Waiting Deposit" || record.paymentStatus === "Overdue Payment") {
    timing = "1 business day later";
  }
  return { action, timing };
}

export function emailTemplate(stage: CurrentStage, reply: ReplyStatus, name = "[Name]", blocker = "") {
  if (stage === "Payment Pending") return { subject: "Follow-up on payment and stock arrangement", body: `Hi ${name},\n\nI am checking the payment schedule so we can reserve stock or arrange production in time. Please let me know if you need a PI update.\n\nBest regards,\nAmy` };
  if (reply === "Need OEM Details" || blocker.includes("OEM")) return { subject: "Next step for OEM portable power station project", body: `Hi ${name},\n\nFor the OEM project, I can prepare model comparison, logo/package options, MOQ and certification details. Which part should we confirm first?\n\nBest regards,\nAmy` };
  if (reply === "Need Meeting" || stage === "Meeting Scheduled") return { subject: "Schedule a short meeting this week?", body: `Hi ${name},\n\nWould you be available for a short meeting this week? I can prepare product comparison, price points and key questions before the call.\n\nBest regards,\nAmy` };
  if (stage === "Quotation Sent" || reply === "Need Price") return { subject: "Follow-up on the quotation", body: `Hi ${name},\n\nI am following up on the quotation. Could you share feedback on price, target quantity, plug type and expected delivery time?\n\nBest regards,\nAmy` };
  if (stage === "Product Catalog Sent" || reply === "Need Catalog") return { subject: "Latest portable power station catalog", body: `Hi ${name},\n\nI am sharing the latest OUKITEL portable power station catalog. Which capacity range and business model are most relevant for your market?\n\nBest regards,\nAmy` };
  if (stage === "Dormant") return { subject: "New portable power station update for your market", body: `Hi ${name},\n\nWe have new OUKITEL portable power station updates that may fit your market. I would be happy to share latest models, stock options and promotion ideas.\n\nBest regards,\nAmy` };
  return { subject: "Following up on portable power station cooperation", body: `Hi ${name},\n\nThis is Amy from OUKITEL. I am following up on portable power station cooperation and can send the latest catalog and recommended models for your market.\n\nBest regards,\nAmy` };
}

export function whatsappTemplate(record: FollowUpRecord) {
  if (record.currentStage === "Payment Pending") return `Hi ${record.customerName}, just checking the payment schedule so we can reserve stock / arrange production in time.`;
  if (record.replyStatus === "Need OEM Details") return `Hi ${record.customerName}, just checking the next step for your OEM project. Do you need model comparison, pricing or packaging details?`;
  if (record.currentStage === "Quotation Sent") return `Hi ${record.customerName}, just following up on the quotation. Do you have any feedback on price, quantity or delivery time?`;
  if (record.currentStage === "Meeting Scheduled") return `Hi ${record.customerName}, just confirming our meeting time. I'll prepare the product comparison and pricing points before the call.`;
  return `Hi ${record.customerName}, this is Amy. Just checking if you received my email about portable power stations. I can send the latest catalog if helpful.`;
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

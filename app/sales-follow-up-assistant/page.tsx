"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Badge, Modal, Toast } from "@/components/Ui";
import { initialFollowUps, markets } from "@/lib/data";
import { emailTemplate, formatUSD, getPriority, getSuggestion, whatsappTemplate } from "@/lib/follow-up";
import { formatISODate, formatTime } from "@/lib/time";
import type {
  AnnualPotential,
  BusinessModel,
  ChannelStrength,
  ContactMethod,
  CurrentStage,
  CustomerType,
  CustomerValueTier,
  DecisionConfirmed,
  EvaluationLevel,
  FollowUpEvent,
  FollowUpRecord,
  FollowUpRhythm,
  InterestedModel,
  LeadTemperature,
  NextMilestone,
  OemReason,
  PaymentRisk,
  PaymentStatus,
  ProductCategory,
  ReminderStatus,
  ReplyStatus,
  RiskLevel,
  SourceChannel,
} from "@/lib/types";

const STORAGE_KEY = "amy-b2b-sales-follow-up-records-v2";
const LEGACY_STORAGE_KEY = "oukitel-sales-follow-up-records-v1";

const customerTypes: CustomerType[] = ["OEM Brand", "Distributor", "Wholesaler", "Retailer", "Chain Store", "Solar Installer", "EPC Contractor", "E-commerce Seller", "Generator Dealer", "Competitor Dealer", "Other"];
const sources: SourceChannel[] = ["Email", "LinkedIn", "Alibaba", "Website Inquiry", "Exhibition", "WhatsApp", "Xiaoman CRM", "Referral", "Other"];
const categories: ProductCategory[] = ["Portable Power Station", "Solar Generator", "Solar Panel", "Home Energy Storage", "Balcony Energy Storage", "Inverter + Battery System", "High-power Energy Storage", "Accessories"];
const models: InterestedModel[] = ["P800E", "P1000E Plus", "P1500E Plus", "P2001E Plus", "P2001E Pro", "P5000E Plus", "BP5000E Pro Max", "BP2000 Pro", "12kW Inverter System", "Battery Pack", "Solar Panel", "TBD"];
const businessModels: BusinessModel[] = ["Bulk Purchase", "Exclusive Agent", "Regional Distributor", "OEM Branding", "ODM Project", "Dropshipping", "Retail Chain Supply", "Project Order", "Government / Emergency Supply", "TBD"];
const methods: ContactMethod[] = ["Email", "WhatsApp", "Phone Call", "Online Meeting", "LinkedIn Message", "Exhibition Meeting", "Factory Visit", "Customer Visit"];
const stages: CurrentStage[] = ["New Lead", "First Contact Sent", "Replied", "Product Catalog Sent", "Quotation Sent", "Sample Discussion", "Negotiation", "Meeting Scheduled", "Factory Visit Done", "Waiting Reply", "Payment Pending", "Closed Won", "Closed Lost", "Dormant"];
const replies: ReplyStatus[] = ["No Reply", "Replied", "Interested", "Not Interested", "Need Price", "Need Catalog", "Need Meeting", "Need Samples", "Need OEM Details", "Need Distributor Terms", "Need Stock Information", "Need Technical Confirmation"];
const temperatures: LeadTemperature[] = ["Hot", "Warm", "Cold", "Unknown"];
const rhythms: FollowUpRhythm[] = ["Daily", "Every 2-3 Days", "Weekly", "Bi-weekly", "Monthly", "Quarterly"];
const valueTiers: CustomerValueTier[] = ["A", "B", "C", "D"];
const annualPotentials: AnnualPotential[] = ["<100K USD", "100K-500K USD", "500K-1M USD", "1M+ USD", "Unknown"];
const levels: EvaluationLevel[] = ["High", "Medium", "Low", "Unknown"];
const channelStrengths: ChannelStrength[] = ["Strong", "Medium", "Weak", "Unknown"];
const decisionOptions: DecisionConfirmed[] = ["Yes", "No", "Unknown"];
const oemReasons: OemReason[] = ["Own brand development", "Avoid direct competition", "Higher margin", "Market positioning", "Distributor exclusivity", "Competitor price too high", "Other", "Unknown"];
const paymentRisks: PaymentRisk[] = ["Low", "Medium", "High", "Very High", "Unknown"];
const payments: PaymentStatus[] = ["Not Started", "Waiting Deposit", "Deposit Paid", "Waiting Balance", "Paid", "Overdue Payment", "Not Applicable"];
const risks: RiskLevel[] = ["Low", "Medium", "High"];
const milestones: NextMilestone[] = ["PI confirmation", "Sample payment", "OEM artwork confirmation", "Packaging confirmation", "First order deposit", "Factory visit", "Online meeting", "Shipment arrangement", "Price approval", "Distributor terms confirmation", "Stock confirmation", "Payment plan confirmation", "Model selection", "Other"];
const probabilities = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const nextActions = ["Send product catalog", "Send quotation", "Follow up quotation", "Ask for target quantity", "Ask for business model", "Schedule online meeting", "Send product comparison", "Send certification documents", "Send OEM/ODM details", "Send distributor terms", "Send stock update", "Send WhatsApp message", "Confirm payment plan", "Confirm sample details", "Wait for reply", "Mark as low priority"];
const blockers = ["Waiting customer reply", "Price not confirmed", "Target price gap", "Payment risk", "Stock issue", "Certification requirement", "OEM details unclear", "Shipping cost issue", "Exclusive terms not confirmed", "Internal approval pending", "Competitor comparison", "Need boss decision", "Need technical support", "Model selection"];

const quickViews = ["Today's Follow-ups", "Strategic Customers", "A-Tier Value Customers", "Boss Decision Needed", "High Payment Risk", "Missing Key Questions", "OEM Potential", "Competitor Dealer Background", "High Annual Potential", "Next Milestone Due", "Due Today", "Due Tomorrow", "Due This Week", "Overdue Follow-ups", "No Follow-up Date", "High Priority Pipeline", "Waiting Reply", "Quotation Sent", "Payment Pending", "Dormant Customers"] as const;
const mainViewOptions = ["All Customers", "Active Customers", "Strategic Customers", "Due Today", "Overdue", "Payment Pending", "Boss Decision Needed"] as const;
const filterKeys = ["region", "currentStage", "replyStatus", "followUpRhythm", "leadTemperature", "customerValueTier", "reminderStatus", "strategicCustomer", "bossDecisionNeeded", "paymentRisk", "nextFollowUpDate", "annualPotential", "channelStrength", "currentCompetitorSales", "customerType", "sourceChannel", "productCategory", "interestedModel", "businessModel"] as const;
const advancedFilterKeys = ["replyStatus", "followUpRhythm", "leadTemperature", "customerValueTier", "reminderStatus", "strategicCustomer", "bossDecisionNeeded", "paymentRisk", "nextFollowUpDate", "annualPotential", "channelStrength", "currentCompetitorSales", "customerType", "sourceChannel", "productCategory", "interestedModel", "businessModel"] as const;

type FilterKey = (typeof filterKeys)[number];
type MainView = (typeof mainViewOptions)[number];
type ModalState = "add" | "edit" | "email" | "whatsapp" | "log" | "followup" | null;
type EnrichedRecord = FollowUpRecord & {
  priority: string;
  suggestion: ReturnType<typeof getSuggestion>;
  reminderStatus: ReminderStatus;
  missingKeyQuestions: string[];
};

const emptyFilters: Record<FilterKey, string> = Object.fromEntries(filterKeys.map((key) => [key, ""])) as Record<FilterKey, string>;

function OptionList({ values }: { values: readonly (string | number)[] }) {
  return <>{values.map((value) => <option key={value} value={value}>{value}</option>)}</>;
}

function copy(text: string, done: (value: string) => void) {
  navigator.clipboard.writeText(text).then(() => done("Copied to clipboard"));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addBusinessDays(date: Date, days: number) {
  const next = new Date(date);
  let remaining = days;
  while (remaining > 0) {
    next.setDate(next.getDate() + 1);
    if (next.getDay() !== 0 && next.getDay() !== 6) remaining -= 1;
  }
  return next;
}

function formatDateLocal(date: Date) {
  return date.toISOString().slice(0, 10);
}

function reminderStatusFromDate(nextFollowUpDate: string, today: string): ReminderStatus {
  if (!nextFollowUpDate) return "No Date Set";
  if (nextFollowUpDate < today) return "Overdue";
  if (nextFollowUpDate === today) return "Due Today";
  const tomorrow = formatDateLocal(addDays(new Date(`${today}T00:00:00`), 1));
  if (nextFollowUpDate === tomorrow) return "Due Tomorrow";
  const inSevenDays = formatDateLocal(addDays(new Date(`${today}T00:00:00`), 7));
  if (nextFollowUpDate <= inSevenDays) return "Due This Week";
  return "Not Due Yet";
}

function suggestNextFollowUpDate(stage: CurrentStage, rhythm: FollowUpRhythm, today: string) {
  const base = new Date(`${today}T00:00:00`);
  if (stage === "Payment Pending") return formatDateLocal(addBusinessDays(base, 1));
  if (["Negotiation", "Quotation Sent", "Sample Discussion"].includes(stage)) return formatDateLocal(addBusinessDays(base, 2));
  if (stage === "Meeting Scheduled") return formatDateLocal(addBusinessDays(base, 1));
  if (stage === "Waiting Reply") return formatDateLocal(addDays(base, 7));
  if (stage === "Dormant") return formatDateLocal(addDays(base, 30));
  if (rhythm === "Daily") return formatDateLocal(addDays(base, 1));
  if (rhythm === "Every 2-3 Days") return formatDateLocal(addBusinessDays(base, 2));
  if (rhythm === "Weekly") return formatDateLocal(addDays(base, 7));
  if (rhythm === "Bi-weekly") return formatDateLocal(addDays(base, 14));
  if (rhythm === "Monthly") return formatDateLocal(addDays(base, 30));
  return formatDateLocal(addDays(base, 90));
}

function resolveMarket(country: string, city: string, currentRegion?: FollowUpRecord["region"], currentTimeZone?: string) {
  const exact = markets.find((market) => market.country === country && market.city === city);
  if (exact) return exact;
  const byCountry = markets.find((market) => market.country === country);
  if (byCountry) return { ...byCountry, city: city || byCountry.city };
  return { country, city: city || "TBD", region: currentRegion ?? "Europe", timeZone: currentTimeZone ?? "Europe/Berlin" };
}

function mapLegacyGrade(legacy?: FollowUpRecord["customerGrade"]): FollowUpRhythm {
  if (legacy === "A - High Priority") return "Every 2-3 Days";
  if (legacy === "B - Medium Priority") return "Weekly";
  return "Monthly";
}

function normalizeRecord(record: FollowUpRecord): FollowUpRecord {
  return {
    ...record,
    followUpRhythm: record.followUpRhythm ?? mapLegacyGrade(record.customerGrade),
    customerValueTier: record.customerValueTier ?? "C",
    followUpSummary: record.followUpSummary ?? record.notes ?? record.followUpContent ?? "Follow-up summary not added yet.",
    annualPotential: record.annualPotential ?? "Unknown",
    companyValue: record.companyValue ?? "Unknown",
    channelStrength: record.channelStrength ?? "Unknown",
    lastYearSalesRevenue: record.lastYearSalesRevenue ?? "",
    annualSalesVolume: record.annualSalesVolume ?? "",
    mainSalesChannels: record.mainSalesChannels ?? "",
    purchasePlan12Months: record.purchasePlan12Months ?? "",
    firstOrderEstimate: record.firstOrderEstimate ?? "",
    decisionMakerConfirmed: record.decisionMakerConfirmed ?? "Unknown",
    currentCompetitorSales: record.currentCompetitorSales ?? "",
    oemReason: record.oemReason ?? "Unknown",
    whyWeCanWin: record.whyWeCanWin ?? "",
    whyWeMayLose: record.whyWeMayLose ?? "",
    paymentRisk: record.paymentRisk ?? "Unknown",
    riskControlPlan: record.riskControlPlan ?? "",
    bossDecisionNeeded: record.bossDecisionNeeded ?? record.needBossSupport ?? "No",
    bossDecisionNotes: record.bossDecisionNotes ?? "",
    nextMilestone: record.nextMilestone ?? "Other",
    milestoneDueDate: record.milestoneDueDate ?? "",
    strategicCustomer: record.strategicCustomer ?? "No",
    seasonalDemandDriver: record.seasonalDemandDriver ?? "",
  };
}

function missingKeyQuestions(record: FollowUpRecord) {
  const checks: Array<[string, string]> = [
    ["Last Year Sales Revenue", record.lastYearSalesRevenue],
    ["Annual Sales Volume", record.annualSalesVolume],
    ["Main Sales Channels", record.mainSalesChannels],
    ["Purchase Plan 6-12 Months", record.purchasePlan12Months],
    ["First Order Estimate", record.firstOrderEstimate],
    ["Decision Maker Confirmed", record.decisionMakerConfirmed],
    ["Current Competitor Sales", record.currentCompetitorSales],
    ["Payment Risk", record.paymentRisk],
    ["Next Milestone", record.nextMilestone],
  ];
  return checks.filter(([, value]) => !value || value === "Unknown" || value === "Other").map(([label]) => label);
}

function buildRecordFromForm(form: FormData, current?: FollowUpRecord): FollowUpRecord {
  const market = resolveMarket(String(form.get("country")), String(form.get("city")), current?.region, current?.timeZone);
  const currentDate = String(form.get("contactDate"));
  const contactMethod = form.get("contactMethod") as ContactMethod;
  const replyStatus = form.get("replyStatus") as ReplyStatus;

  return {
    id: current?.id ?? crypto.randomUUID(),
    customerName: String(form.get("customerName")),
    company: String(form.get("company")),
    country: market.country,
    city: String(form.get("city")) || market.city,
    region: market.region,
    timeZone: market.timeZone,
    email: String(form.get("email")),
    whatsapp: String(form.get("whatsapp")),
    linkedin: String(form.get("linkedin")),
    customerType: form.get("customerType") as CustomerType,
    sourceChannel: form.get("sourceChannel") as SourceChannel,
    productCategory: form.get("productCategory") as ProductCategory,
    interestedModel: form.get("interestedModel") as InterestedModel,
    businessModel: form.get("businessModel") as BusinessModel,
    targetMarket: String(form.get("targetMarket")),
    estimatedQuantity: String(form.get("estimatedQuantity")),
    plugType: String(form.get("plugType")),
    certificationRequirement: String(form.get("certificationRequirement")),
    oemOdmRequirement: String(form.get("oemOdmRequirement")),
    lastContactDate: currentDate,
    lastContactTime: String(form.get("contactTime")),
    lastContactMethod: contactMethod,
    followUpContent: String(form.get("followUpContent")),
    customerReply: String(form.get("customerReply")),
    currentStage: form.get("currentStage") as CurrentStage,
    replyStatus,
    leadTemperature: form.get("leadTemperature") as LeadTemperature,
    followUpRhythm: form.get("followUpRhythm") as FollowUpRhythm,
    customerValueTier: form.get("customerValueTier") as CustomerValueTier,
    followUpSummary: String(form.get("followUpSummary")),
    nextAction: String(form.get("nextAction")),
    nextFollowUpDate: String(form.get("nextFollowUpDate")),
    notes: String(form.get("notes")),
    estimatedOrderValue: Number(form.get("estimatedOrderValue") || 0),
    probability: Number(form.get("probability") || 10),
    expectedCloseDate: String(form.get("expectedCloseDate")),
    paymentStatus: form.get("paymentStatus") as PaymentStatus,
    riskLevel: form.get("riskLevel") as RiskLevel,
    mainBlocker: String(form.get("mainBlocker")),
    needBossSupport: form.get("needBossSupport") as "Yes" | "No",
    needTeamSupport: String(form.get("needTeamSupport")),
    forecastNotes: String(form.get("forecastNotes")),
    annualPotential: form.get("annualPotential") as AnnualPotential,
    companyValue: form.get("companyValue") as EvaluationLevel,
    channelStrength: form.get("channelStrength") as ChannelStrength,
    lastYearSalesRevenue: String(form.get("lastYearSalesRevenue")),
    annualSalesVolume: String(form.get("annualSalesVolume")),
    mainSalesChannels: String(form.get("mainSalesChannels")),
    purchasePlan12Months: String(form.get("purchasePlan12Months")),
    firstOrderEstimate: String(form.get("firstOrderEstimate")),
    decisionMakerConfirmed: form.get("decisionMakerConfirmed") as DecisionConfirmed,
    currentCompetitorSales: String(form.get("currentCompetitorSales")),
    oemReason: form.get("oemReason") as OemReason,
    whyWeCanWin: String(form.get("whyWeCanWin")),
    whyWeMayLose: String(form.get("whyWeMayLose")),
    paymentRisk: form.get("paymentRisk") as PaymentRisk,
    riskControlPlan: String(form.get("riskControlPlan")),
    bossDecisionNeeded: form.get("bossDecisionNeeded") as "Yes" | "No",
    bossDecisionNotes: String(form.get("bossDecisionNotes")),
    nextMilestone: form.get("nextMilestone") as NextMilestone,
    milestoneDueDate: String(form.get("milestoneDueDate")),
    strategicCustomer: form.get("strategicCustomer") as "Yes" | "No",
    seasonalDemandDriver: String(form.get("seasonalDemandDriver")),
    history: current?.history?.length
      ? current.history
      : [{
          id: crypto.randomUUID(),
          date: currentDate,
          method: contactMethod,
          content: String(form.get("followUpContent")) || "Initial customer record created.",
          reply: String(form.get("customerReply")) || replyStatus,
        }],
    emailLogs: current?.emailLogs ?? [],
    customerGrade: current?.customerGrade,
  };
}

function enrichRecord(record: FollowUpRecord, today: string): EnrichedRecord {
  const normalized = normalizeRecord(record);
  return {
    ...normalized,
    priority: getPriority(normalized),
    suggestion: getSuggestion(normalized),
    reminderStatus: reminderStatusFromDate(normalized.nextFollowUpDate, today),
    missingKeyQuestions: missingKeyQuestions(normalized),
  };
}

function shortText(value: string, max = 72) {
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function priorityScore(record: EnrichedRecord) {
  let score = 0;
  if (record.reminderStatus === "Overdue") score += 50;
  if (record.reminderStatus === "Due Today") score += 40;
  if (record.reminderStatus === "Due Tomorrow") score += 28;
  if (record.strategicCustomer === "Yes") score += 30;
  if (record.bossDecisionNeeded === "Yes") score += 20;
  if (record.customerValueTier === "A") score += 18;
  if (record.paymentRisk === "High" || record.paymentRisk === "Very High") score += 12;
  if (record.followUpRhythm === "Daily") score += 12;
  if (record.followUpRhythm === "Every 2-3 Days") score += 8;
  if (record.missingKeyQuestions.length >= 4) score += 6;
  if (record.currentStage === "Payment Pending") score += 16;
  return score;
}

function matchesSearch(record: EnrichedRecord, search: string) {
  if (!search.trim()) return true;
  const query = search.toLowerCase();
  return [
    record.customerName,
    record.company,
    record.country,
    record.region,
    record.interestedModel,
    record.currentCompetitorSales,
    record.sourceChannel,
    record.customerType,
  ].some((value) => String(value ?? "").toLowerCase().includes(query));
}

function matchesMainView(record: EnrichedRecord, mainView: MainView) {
  if (mainView === "All Customers") return true;
  if (mainView === "Active Customers") return !["Closed Won", "Closed Lost", "Dormant"].includes(record.currentStage);
  if (mainView === "Strategic Customers") return record.strategicCustomer === "Yes";
  if (mainView === "Due Today") return record.reminderStatus === "Due Today";
  if (mainView === "Overdue") return record.reminderStatus === "Overdue";
  if (mainView === "Payment Pending") return record.currentStage === "Payment Pending" || record.paymentStatus.includes("Waiting");
  if (mainView === "Boss Decision Needed") return record.bossDecisionNeeded === "Yes";
  return true;
}

export default function FollowUpAssistant() {
  const [records, setRecords] = useState<FollowUpRecord[]>(initialFollowUps.map(normalizeRecord));
  const [filters, setFilters] = useState(emptyFilters);
  const [quickView, setQuickView] = useState("");
  const [mainView, setMainView] = useState<MainView>("All Customers");
  const [search, setSearch] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [selected, setSelected] = useState<FollowUpRecord | null>(null);
  const [toast, setToast] = useState("");
  const tableSectionRef = useRef<HTMLElement | null>(null);
  const today = formatISODate(new Date(), "Asia/Shanghai");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as FollowUpRecord[];
      setRecords(parsed.map(normalizeRecord));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const enriched = useMemo(() => records.map((record) => enrichRecord(record, today)), [records, today]);
  const filtered = useMemo(
    () =>
      enriched
        .filter((record) =>
          matchesSearch(record, search) &&
          matchesMainView(record, mainView) &&
          (!filters.region || record.region === filters.region) &&
          (!filters.currentStage || record.currentStage === filters.currentStage) &&
          advancedFilterKeys.every((key) => !filters[key] || String(record[key as keyof EnrichedRecord] ?? "").toLowerCase().includes(filters[key].toLowerCase())) &&
          (!quickView || matchesView(record, quickView, today)),
        )
        .sort((a, b) => priorityScore(b) - priorityScore(a) || a.customerName.localeCompare(b.customerName)),
    [enriched, filters, mainView, quickView, search, today],
  );
  const isCustomerModalOpen = modal === "add" || modal === "edit" || modal === "log" || modal === "followup";

  const summary = {
    due: enriched.filter((record) => record.reminderStatus === "Due Today").length,
    overdue: enriched.filter((record) => record.reminderStatus === "Overdue").length,
    dueWeek: enriched.filter((record) => record.reminderStatus === "Due This Week" || record.reminderStatus === "Due Tomorrow").length,
    noDate: enriched.filter((record) => record.reminderStatus === "No Date Set").length,
    strategic: records.filter((record) => record.strategicCustomer === "Yes").length,
    valueA: records.filter((record) => record.customerValueTier === "A").length,
    bossDecision: records.filter((record) => record.bossDecisionNeeded === "Yes").length,
    highRisk: records.filter((record) => record.paymentRisk === "High" || record.paymentRisk === "Very High").length,
    missing: enriched.filter((record) => record.missingKeyQuestions.length > 0).length,
    highAnnualPotential: records.filter((record) => record.annualPotential === "500K-1M USD" || record.annualPotential === "1M+ USD").length,
    oemPotential: records.filter((record) => record.oemReason !== "Unknown" && record.oemReason !== "Other").length,
    pipeline: records.reduce((sum, record) => sum + record.estimatedOrderValue * (record.probability / 100), 0),
  };

  const selectedEnriched = selected ? enrichRecord(selected, today) : null;
  const selectedTemplate = selectedEnriched
    ? emailTemplate(selectedEnriched.currentStage, selectedEnriched.replyStatus, selectedEnriched.customerName, selectedEnriched.mainBlocker)
    : emailTemplate("New Lead", "No Reply");

  const winReasons = [...new Set(enriched.map((record) => record.whyWeCanWin).filter(Boolean))].slice(0, 3).join(", ");
  const loseReasons = [...new Set(enriched.map((record) => record.whyWeMayLose).filter(Boolean))].slice(0, 3).join(", ");
  const milestonesThisWeek =
    enriched
      .filter((record) => record.milestoneDueDate && record.milestoneDueDate >= today && record.milestoneDueDate <= formatDateLocal(addDays(new Date(`${today}T00:00:00`), 7)))
      .map((record) => record.nextMilestone)
      .slice(0, 4)
      .join(", ") || "None";

  const plan = `Today's follow-up plan:
- Due today: ${summary.due}
- Overdue: ${summary.overdue}
- Strategic customers: ${summary.strategic}
- Boss decision needed: ${summary.bossDecision}
- Start with overdue, strategic, payment-pending, and boss-decision customers first.
- Latest follow-up summaries: ${filtered.slice(0, 3).map((record) => `${record.customerName}: ${record.followUpSummary}`).join(" | ")}`;

  const bossReport = `Boss Weekly Report:
This week I managed ${records.length} active customer records.
Strategic customers: ${summary.strategic}.
A-tier value customers: ${summary.valueA}.
Boss decision needed: ${summary.bossDecision}.
High payment risk customers: ${summary.highRisk}.
Customers missing key qualification questions: ${summary.missing}.
Customers with OEM potential: ${summary.oemPotential}.
High annual potential customers: ${summary.highAnnualPotential}.
Next milestones this week: ${milestonesThisWeek}.
Main opportunities: ${winReasons || "None recorded"}.
Main risks: ${loseReasons || "None recorded"}.`;

  function options(key: FilterKey) {
    return [...new Set(enriched.map((record) => String(record[key as keyof EnrichedRecord] ?? "")))].filter(Boolean).sort();
  }

  function clearAllViewsAndFilters() {
    setSearch("");
    setMainView("All Customers");
    setQuickView("");
    setFilters(emptyFilters);
    setShowAdvancedFilters(false);
  }

  function clearAdvancedFilters() {
    setFilters((current) => {
      const next = { ...current };
      for (const key of advancedFilterKeys) next[key] = "";
      return next;
    });
  }

  function openRecord(record: FollowUpRecord) {
    setSelected(record);
  }

  function openEdit(record: FollowUpRecord) {
    setSelected(record);
    setModal("edit");
  }

  function openFollowUpLog(record: FollowUpRecord) {
    setSelected(record);
    setModal("followup");
  }

  function openManualEmailLog(record?: FollowUpRecord) {
    if (record) setSelected(record);
    setModal("log");
  }

  function deleteRecordById(recordId: string) {
    const target = records.find((record) => record.id === recordId);
    if (!target) return;
    if (!window.confirm(`Delete customer "${target.customerName}"?`)) return;
    setRecords((current) => current.filter((record) => record.id !== recordId));
    if (selected?.id === recordId) setSelected(null);
    setToast("Customer deleted successfully.");
  }

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record = normalizeRecord(buildRecordFromForm(new FormData(event.currentTarget)));
    clearAllViewsAndFilters();
    setRecords((current) => [record, ...current]);
    setSelected(record);
    setModal(null);
    setToast("New customer saved and added to Customer Master List.");
    setTimeout(() => tableSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function updateRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const updated = normalizeRecord(buildRecordFromForm(new FormData(event.currentTarget), selected));
    setRecords((current) => current.map((record) => (record.id === updated.id ? updated : record)));
    setSelected(updated);
    setModal(null);
    setToast("Customer updated successfully.");
  }

  function deleteRecord() {
    if (!selected) return;
    deleteRecordById(selected.id);
  }

  const activeFilters = filterKeys
    .filter((key) => filters[key])
    .map((key) => `${labelFor(key)} = ${filters[key]}`);
  const isFilteredView = Boolean(quickView || activeFilters.length);
  const hasAdvancedFilters = advancedFilterKeys.some((key) => filters[key]);
  const activeStatusParts = [
    quickView ? `Active quick view: ${quickView}` : "",
    mainView !== "All Customers" ? `View: ${mainView}` : "",
    search ? `Search: ${search}` : "",
    filters.region ? `Region = ${filters.region}` : "",
    filters.currentStage ? `Current Stage = ${filters.currentStage}` : "",
    activeFilters.filter((item) => !item.startsWith("Region =") && !item.startsWith("Current Stage =")).length
      ? `Active filters: ${activeFilters.filter((item) => !item.startsWith("Region =") && !item.startsWith("Current Stage =")).join(", ")}`
      : "",
  ].filter(Boolean);

  function addEmailLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const recordId = String(form.get("recordId"));
    const log = {
      sentDate: String(form.get("sentDate")),
      subject: String(form.get("subject")),
      summary: String(form.get("summary")),
      replySummary: String(form.get("replySummary")),
      replyStatus: form.get("emailReplyStatus") as ReplyStatus,
    };

    let nextSelected: FollowUpRecord | null = null;
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== recordId) return record;
        const updated = normalizeRecord({ ...record, emailLogs: [log, ...record.emailLogs], replyStatus: log.replyStatus });
        if (selected?.id === updated.id) nextSelected = updated;
        return updated;
      }),
    );
    if (nextSelected) setSelected(nextSelected);
    setModal(null);
    setToast("Email log added.");
  }

  function addFollowUpLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const form = new FormData(event.currentTarget);
    const nextRhythm = String(form.get("followUpRhythmUpdate")) as FollowUpRhythm | "";
    const nextTier = String(form.get("followUpValueTierUpdate")) as CustomerValueTier | "";
    const log: FollowUpEvent = {
      id: crypto.randomUUID(),
      date: String(form.get("followUpDate")),
      method: form.get("followUpMethod") as ContactMethod,
      content: String(form.get("followUpContent")),
      reply: String(form.get("followUpReply")) || String(form.get("followUpReplyStatus")),
    };

    let nextSelected: FollowUpRecord | null = null;
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== selected.id) return record;
        const updated = normalizeRecord({
          ...record,
          lastContactDate: log.date,
          lastContactMethod: log.method,
          followUpContent: String(form.get("followUpContent")),
          customerReply: String(form.get("followUpReply")),
          replyStatus: form.get("followUpReplyStatus") as ReplyStatus,
          followUpRhythm: nextRhythm || record.followUpRhythm,
          customerValueTier: nextTier || record.customerValueTier,
          followUpSummary: String(form.get("followUpSummary")) || record.followUpSummary,
          nextAction: String(form.get("followUpNextAction")),
          nextFollowUpDate: String(form.get("followUpNextDate")),
          notes: String(form.get("followUpNotes")) || record.notes,
          history: [log, ...record.history],
        });
        nextSelected = updated;
        return updated;
      }),
    );

    if (nextSelected) setSelected(nextSelected);
    setModal(null);
    setToast("Follow-up log saved successfully.");
  }

  function exportCsv() {
    const keys = ["customerName", "company", "followUpRhythm", "customerValueTier", "strategicCustomer", "annualPotential", "bossDecisionNeeded", "nextMilestone", "nextFollowUpDate", "reminderStatus"] as const;
    const csv = [keys.join(","), ...filtered.map((record) => keys.map((key) => `"${String(record[key]).replaceAll('"', '""')}"`).join(","))].join("\n");
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    anchor.download = `amy-follow-up-${today}.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    setToast("CSV exported.");
  }

  function resetDemoData() {
    if (!window.confirm("Reset all customer changes and restore the original demo data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setRecords(initialFollowUps.map(normalizeRecord));
    setSelected(null);
    setModal(null);
    setToast("Demo data restored.");
  }

  return (
    <main>
      <AppHeader
        title="Amy B2B Sales Follow-up Assistant"
        subtitle="Manage follow-up rhythm, customer value, risks, milestones and boss decisions in one place."
        links={[
          { label: "Open Global Time Board", href: "/global-time-board", primary: true },
          { label: "Back to Dashboard", href: "/" },
        ]}
      />

      <div className="page-shell assistant-shell">
        <small className="section-note">Customer Pipeline Summary: A quick overview of strategic customers, follow-up workload, risk, boss decisions and estimated opportunity value.</small>
        <section className="summary-grid summary-many">
          {[
            ["Strategic Customers", summary.strategic, "Long-term key accounts"],
            ["A-Tier Value", summary.valueA, "High-value customer potential"],
            ["Boss Decision Needed", summary.bossDecision, "Price / OEM / terms approval"],
            ["High Payment Risk", summary.highRisk, "Needs payment risk control"],
            ["Missing Key Questions", summary.missing, "Qualification info incomplete"],
            ["OEM Potential", summary.oemPotential, "Private label / OEM opportunities"],
            ["Due Today", summary.due, "Follow-up required today"],
            ["Overdue", summary.overdue, "Missed follow-up deadline"],
            ["Due This Week", summary.dueWeek, "Follow-up planned this week"],
            ["High Annual Potential", summary.highAnnualPotential, "500K+ or 1M+ potential"],
            ["Estimated Pipeline Value", formatUSD(summary.pipeline), "Total estimated opportunity"],
          ].map(([label, value, subtitle], index) => (
            <article className={`summary-card s${index % 8}`} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{subtitle}</small>
            </article>
          ))}
        </section>

        <section className="section command-bar">
          <div>
            <h2>Daily Amy follow-up workspace</h2>
            <p>{filtered.length} records shown | Start with overdue, strategic and boss-decision customers first.</p>
            <small className="section-note">Follow-up Rhythm = how often to follow up. Lead Temperature = current buying urgency. Customer Value Tier = long-term business value.</small>
          </div>
          <div className="actions">
            <button className="button primary" onClick={() => setModal("add")}>+ Add New Customer</button>
            <button className="button" onClick={exportCsv}>Export CSV</button>
            <button className="button" onClick={() => copy(plan, setToast)}>Copy Today's Follow-up Plan</button>
            <button className="button" onClick={() => copy(bossReport, setToast)}>Copy Boss Weekly Report</button>
            <button className="button" onClick={resetDemoData}>Reset Demo Data</button>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Quick views</h2>
              <p>Jump directly into value, risk and next-step decisions.</p>
            </div>
            {quickView ? <button className="text-button" onClick={() => setQuickView("")}>Clear quick view</button> : null}
          </div>
          <div className="quick-actions">
            {quickViews.map((view) => (
              <button className={quickView === view ? "active" : ""} key={view} onClick={() => setQuickView(view)}>
                {view}
              </button>
            ))}
          </div>
        </section>

        <section className="section follow-table-section" ref={tableSectionRef}>
          <div className="section-head active-view-bar">
            <div>
              <h2>Customer Master List</h2>
              <p>All customer records. Search or filter by market and sales stage.</p>
              <small className="section-note">Showing {filtered.length} of {records.length} customers{isFilteredView || mainView !== "All Customers" || search ? " | Filtered view active" : ""}</small>
            </div>
            <button className="button" onClick={clearAllViewsAndFilters}>Show All Customers</button>
          </div>
          <div className="filter-status-bar">
            <strong>{isFilteredView || mainView !== "All Customers" || search ? "Filtered view active" : "Showing all customers"}</strong>
            <small>
              {activeStatusParts.length ? activeStatusParts.join(" | ") : "Showing all customers"}
            </small>
          </div>
          <div className="filter-bar simple-filter-bar">
            <label>
              <span>Search customer / company</span>
              <input
                placeholder="Search customer, company, market, model, competitor..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              <span>View</span>
              <select value={mainView} onChange={(event) => setMainView(event.target.value as MainView)}>
                <OptionList values={mainViewOptions} />
              </select>
            </label>
            <label>
              <span>Region</span>
              <select value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}>
                <option value="">All</option>
                {options("region").map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>Current Stage</span>
              <select value={filters.currentStage} onChange={(event) => setFilters((current) => ({ ...current, currentStage: event.target.value }))}>
                <option value="">All</option>
                {options("currentStage").map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>
          <section className="advanced-filter-panel">
            <div className="section-head">
              <div>
                <h2>Advanced Filters</h2>
                <p>Open only when you need deeper filtering.</p>
                {hasAdvancedFilters ? <small className="section-note">Advanced filters active</small> : null}
              </div>
              <div className="row-actions">
                {hasAdvancedFilters ? <button className="button" onClick={clearAdvancedFilters}>Clear Advanced Filters</button> : null}
                <button className="button" onClick={() => setShowAdvancedFilters((current) => !current)}>
                  {showAdvancedFilters ? "Advanced Filters ▲" : "Advanced Filters ▼"}
                </button>
              </div>
            </div>
            {showAdvancedFilters ? (
              <div className="filter-bar advanced-filters-grid">
                {advancedFilterKeys.map((key) => (
                  <label key={key}>
                    <span>{labelFor(key)}</span>
                    {key === "nextFollowUpDate" ? (
                      <input type="date" value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))} />
                    ) : (
                      <select value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}>
                        <option value="">All</option>
                        {options(key).map((value) => <option key={value}>{value}</option>)}
                      </select>
                    )}
                  </label>
                ))}
              </div>
            ) : null}
          </section>

          <div className="table-wrap">
            <table className="follow-table wide-follow-table">
              <thead>
                <tr>
                  {[
                    "Customer / Company",
                    "Country / Region / Local Time",
                    "Current Stage",
                    "Reply Status",
                    "Follow-up Rhythm",
                    "Lead Temperature",
                    "Customer Value Tier",
                    "Strategic Customer",
                    "Annual Potential",
                    "Current Competitor Sales",
                    "Boss Decision Needed",
                    "Main Blocker",
                    "Follow-up Summary",
                    "Next Follow-up Date",
                    "Reminder Status",
                    "Estimated Value",
                    "Priority",
                    "Actions",
                  ].map((heading) => <th key={heading}>{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => openRecord(record)}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openRecord(record);
                      }
                    }}
                  >
                    <td><strong>{record.customerName}</strong><span>{record.company}</span></td>
                    <td><strong>{record.country} | {record.region}</strong><span>{formatTime(new Date(), record.timeZone)} local</span></td>
                    <td><Badge kind={record.currentStage}>{record.currentStage}</Badge></td>
                    <td><Badge kind={record.replyStatus}>{record.replyStatus}</Badge></td>
                    <td><Badge kind={record.followUpRhythm}>{record.followUpRhythm}</Badge></td>
                    <td><Badge kind={record.leadTemperature}>{record.leadTemperature}</Badge></td>
                    <td><Badge kind={record.customerValueTier}>{record.customerValueTier}</Badge></td>
                    <td><Badge kind={record.strategicCustomer}>{record.strategicCustomer}</Badge></td>
                    <td>{record.annualPotential}</td>
                    <td>{shortText(record.currentCompetitorSales || "Unknown", 36)}</td>
                    <td><Badge kind={record.bossDecisionNeeded}>{record.bossDecisionNeeded}</Badge></td>
                    <td>{shortText(record.mainBlocker || "None", 28)}</td>
                    <td className="summary-cell"><strong>{shortText(record.followUpSummary)}</strong></td>
                    <td>{record.nextFollowUpDate || "Not set"}</td>
                    <td><Badge kind={record.reminderStatus}>{record.reminderStatus}</Badge></td>
                    <td>{formatUSD(record.estimatedOrderValue)}</td>
                    <td><Badge kind={record.priority}>{record.priority}</Badge></td>
                    <td>
                      <div className="row-actions">
                        <button className="button table-button" onClick={(event) => { event.stopPropagation(); openRecord(record); }}>View</button>
                        <button className="button table-button" onClick={(event) => { event.stopPropagation(); openEdit(record); }}>Edit</button>
                        <button className="button table-button" onClick={(event) => { event.stopPropagation(); openFollowUpLog(record); }}>Add Log</button>
                        <button className="button table-button danger-button" onClick={(event) => { event.stopPropagation(); deleteRecordById(record.id); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? <div className="empty">No records match the current view.</div> : null}
          </div>
        </section>

        <section className="section import-placeholder compact-placeholder">
          <div className="section-head">
            <div>
              <h2>Future Import Sources - Coming Soon</h2>
              <p>Compact placeholder only. No external integrations are enabled in this MVP.</p>
            </div>
          </div>
          <div className="disabled-sources">
            {["Import from CSV", "Import from Excel", "Import from Xiaoman CRM export", "Import from Google Sheets", "Import from Gmail / Outlook sync"].map((value) => <button disabled key={value}>{value}</button>)}
          </div>
          <small>Future version only. This update stays focused on personal follow-up rhythm and customer evaluation.</small>
        </section>
      </div>

      {modal === "add" ? <Modal title="Add New Customer" wide onClose={() => setModal(null)}><FollowUpForm onSubmit={addRecord} onCancel={() => setModal(null)} today={today} submitLabel="Save Customer" /></Modal> : null}
      {modal === "edit" && selected ? <Modal title="Edit Customer" wide onClose={() => setModal(null)}><FollowUpForm onSubmit={updateRecord} onCancel={() => setModal(null)} today={today} submitLabel="Save Changes" initial={selected} /></Modal> : null}
      {modal === "email" ? <Modal title="Follow-up Email Generator" onClose={() => setModal(null)}><TemplatePicker records={records} type="email" onCopy={setToast} /></Modal> : null}
      {modal === "whatsapp" ? <Modal title="WhatsApp Message Generator" onClose={() => setModal(null)}><TemplatePicker records={records} type="whatsapp" onCopy={setToast} /></Modal> : null}
      {modal === "log" ? <Modal title="Add Manual Email Log" onClose={() => setModal(null)}><EmailLogForm records={records} today={today} initialRecordId={selected?.id} onSubmit={addEmailLog} onCancel={() => setModal(null)} /></Modal> : null}
      {modal === "followup" && selected ? <Modal title="Add Follow-up Log" wide onClose={() => setModal(null)}><FollowUpLogForm selected={selected} today={today} onSubmit={addFollowUpLog} onCancel={() => setModal(null)} /></Modal> : null}
      {selectedEnriched && !isCustomerModalOpen ? <DetailDrawer selected={selectedEnriched} selectedTemplate={selectedTemplate} onClose={() => setSelected(null)} onCopy={setToast} onEdit={() => setModal("edit")} onDelete={deleteRecord} onAddFollowUp={() => setModal("followup")} onAddEmailLog={() => openManualEmailLog(selectedEnriched)} onOpenEmailTemplate={() => setModal("email")} onOpenWhatsappTemplate={() => setModal("whatsapp")} /> : null}
      <Toast text={toast} />
    </main>
  );
}

function matchesView(record: EnrichedRecord, view: string, today: string) {
  if (view === "Today's Follow-ups" || view === "Due Today") return record.reminderStatus === "Due Today";
  if (view === "Strategic Customers") return record.strategicCustomer === "Yes";
  if (view === "A-Tier Value Customers") return record.customerValueTier === "A";
  if (view === "Boss Decision Needed") return record.bossDecisionNeeded === "Yes";
  if (view === "High Payment Risk") return record.paymentRisk === "High" || record.paymentRisk === "Very High";
  if (view === "Missing Key Questions") return record.missingKeyQuestions.length > 0;
  if (view === "OEM Potential") return record.oemReason !== "Unknown" && record.oemReason !== "Other";
  if (view === "Competitor Dealer Background") return record.customerType === "Competitor Dealer" || record.currentCompetitorSales.length > 0;
  if (view === "High Annual Potential") return record.annualPotential === "500K-1M USD" || record.annualPotential === "1M+ USD";
  if (view === "Next Milestone Due") return !!record.milestoneDueDate && record.milestoneDueDate <= formatDateLocal(addDays(new Date(`${today}T00:00:00`), 7));
  if (view === "Due Tomorrow") return record.reminderStatus === "Due Tomorrow";
  if (view === "Due This Week") return record.reminderStatus === "Due This Week";
  if (view === "Overdue Follow-ups") return record.reminderStatus === "Overdue";
  if (view === "No Follow-up Date") return record.reminderStatus === "No Date Set";
  if (view === "High Priority Pipeline") return record.priority === "High" || record.customerValueTier === "A";
  if (view === "Waiting Reply") return record.currentStage === "Waiting Reply";
  if (view === "Quotation Sent") return record.currentStage === "Quotation Sent";
  if (view === "Payment Pending") return record.currentStage === "Payment Pending" || record.paymentStatus.includes("Waiting");
  if (view === "Dormant Customers") return record.currentStage === "Dormant";
  return record.nextFollowUpDate === today;
}

function labelFor(key: FilterKey) {
  return ({
    currentStage: "Current Stage",
    replyStatus: "Reply Status",
    followUpRhythm: "Follow-up Rhythm",
    leadTemperature: "Lead Temperature",
    customerValueTier: "Customer Value Tier",
    reminderStatus: "Reminder Status",
    nextFollowUpDate: "Next Follow-up",
    strategicCustomer: "Strategic Customer",
    bossDecisionNeeded: "Boss Decision Needed",
    paymentRisk: "Payment Risk",
    annualPotential: "Annual Potential",
    channelStrength: "Channel Strength",
    currentCompetitorSales: "Current Competitor Sales",
    customerType: "Customer Type",
    sourceChannel: "Source Channel",
    productCategory: "Product Category",
    interestedModel: "Interested Model",
    businessModel: "Business Model",
  } as Partial<Record<FilterKey, string>>)[key] ?? key[0].toUpperCase() + key.slice(1);
}

function FollowUpForm({ onSubmit, onCancel, today, submitLabel, initial }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; today: string; submitLabel: string; initial?: FollowUpRecord }) {
  const [stage, setStage] = useState<CurrentStage>(initial?.currentStage ?? "New Lead");
  const [rhythm, setRhythm] = useState<FollowUpRhythm>(initial?.followUpRhythm ?? "Weekly");
  const [nextFollowUpDate, setNextFollowUpDate] = useState(initial?.nextFollowUpDate ?? suggestNextFollowUpDate(stage, rhythm, today));

  return (
    <form className="follow-form" onSubmit={onSubmit}>
      <p className="form-note">{initial ? "Update the customer and save the latest qualification, risk and follow-up rhythm." : "Create a customer record with practical qualification and rhythm fields."}</p>
      <div className="form-grid">
        <h3>Customer Profile</h3>
        <label>Customer Name<input required name="customerName" defaultValue={initial?.customerName} /></label>
        <label>Company<input required name="company" defaultValue={initial?.company} /></label>
        <label>Country<select name="country" defaultValue={initial?.country ?? markets[0].country}><OptionList values={[...new Set(markets.map((market) => market.country))]} /></select></label>
        <label>City<input name="city" defaultValue={initial?.city} /></label>
        <label>Email<input name="email" type="email" defaultValue={initial?.email} /></label>
        <label>WhatsApp<input name="whatsapp" defaultValue={initial?.whatsapp} /></label>
        <label>LinkedIn<input name="linkedin" defaultValue={initial?.linkedin} /></label>
        <label>Customer Type<select name="customerType" defaultValue={initial?.customerType ?? customerTypes[0]}><OptionList values={customerTypes} /></select></label>
        <label>Source Channel<select name="sourceChannel" defaultValue={initial?.sourceChannel ?? sources[0]}><OptionList values={sources} /></select></label>

        <h3>Follow-up Control</h3>
        <p className="form-note wide">Follow-up Rhythm decides contact frequency. Lead Temperature shows current buying urgency. Customer Value Tier shows long-term commercial value.</p>
        <label>Follow-up Rhythm<select name="followUpRhythm" value={rhythm} onChange={(event) => setRhythm(event.target.value as FollowUpRhythm)}><OptionList values={rhythms} /></select></label>
        <label>Customer Value Tier<select name="customerValueTier" defaultValue={initial?.customerValueTier ?? "C"}><OptionList values={valueTiers} /></select></label>
        <label>Current Stage<select name="currentStage" value={stage} onChange={(event) => setStage(event.target.value as CurrentStage)}><OptionList values={stages} /></select></label>
        <label>Next Follow-up Date<input required name="nextFollowUpDate" type="date" value={nextFollowUpDate} onChange={(event) => setNextFollowUpDate(event.target.value)} /></label>
        <label>Reply Status<select name="replyStatus" defaultValue={initial?.replyStatus ?? replies[0]}><OptionList values={replies} /></select></label>
        <label>Lead Temperature<select name="leadTemperature" defaultValue={initial?.leadTemperature ?? temperatures[0]}><OptionList values={temperatures} /></select></label>
        <label className="wide">Follow-up Summary<textarea required name="followUpSummary" defaultValue={initial?.followUpSummary} /></label>
        <div className="follow-date-helper"><button className="button" type="button" onClick={() => setNextFollowUpDate(suggestNextFollowUpDate(stage, rhythm, today))}>Auto Suggest Next Follow-up Date</button></div>

        <h3>Customer Evaluation Panel</h3>
        <label>Annual Potential<select name="annualPotential" defaultValue={initial?.annualPotential ?? "Unknown"}><OptionList values={annualPotentials} /></select></label>
        <label>Company Value<select name="companyValue" defaultValue={initial?.companyValue ?? "Unknown"}><OptionList values={levels} /></select></label>
        <label>Channel Strength<select name="channelStrength" defaultValue={initial?.channelStrength ?? "Unknown"}><OptionList values={channelStrengths} /></select></label>
        <label>Decision Maker Confirmed<select name="decisionMakerConfirmed" defaultValue={initial?.decisionMakerConfirmed ?? "Unknown"}><OptionList values={decisionOptions} /></select></label>
        <label>Payment Risk<select name="paymentRisk" defaultValue={initial?.paymentRisk ?? "Unknown"}><OptionList values={paymentRisks} /></select></label>
        <label>OEM Reason<select name="oemReason" defaultValue={initial?.oemReason ?? "Unknown"}><OptionList values={oemReasons} /></select></label>
        <label>Boss Decision Needed<select name="bossDecisionNeeded" defaultValue={initial?.bossDecisionNeeded ?? "No"}><OptionList values={["No", "Yes"]} /></select></label>
        <label>Strategic Customer<select name="strategicCustomer" defaultValue={initial?.strategicCustomer ?? "No"}><OptionList values={["No", "Yes"]} /></select></label>
        <label>Next Milestone<select name="nextMilestone" defaultValue={initial?.nextMilestone ?? "Other"}><OptionList values={milestones} /></select></label>
        <label>Milestone Due Date<input name="milestoneDueDate" type="date" defaultValue={initial?.milestoneDueDate} /></label>
        <label className="wide">Last Year Sales Revenue<input name="lastYearSalesRevenue" defaultValue={initial?.lastYearSalesRevenue} /></label>
        <label className="wide">Annual Sales Volume<input name="annualSalesVolume" defaultValue={initial?.annualSalesVolume} /></label>
        <label className="wide">Main Sales Channels<textarea name="mainSalesChannels" defaultValue={initial?.mainSalesChannels} /></label>
        <label className="wide">Purchase Plan 6-12 Months<textarea name="purchasePlan12Months" defaultValue={initial?.purchasePlan12Months} /></label>
        <label className="wide">First Order Estimate<input name="firstOrderEstimate" defaultValue={initial?.firstOrderEstimate} /></label>
        <label className="wide">Current Competitor Sales<textarea name="currentCompetitorSales" defaultValue={initial?.currentCompetitorSales} /></label>
        <label className="wide">Why We Can Win<textarea name="whyWeCanWin" defaultValue={initial?.whyWeCanWin} /></label>
        <label className="wide">Why We May Lose<textarea name="whyWeMayLose" defaultValue={initial?.whyWeMayLose} /></label>
        <label className="wide">Risk Control Plan<textarea name="riskControlPlan" defaultValue={initial?.riskControlPlan} /></label>
        <label className="wide">Boss Decision Notes<textarea name="bossDecisionNotes" defaultValue={initial?.bossDecisionNotes} /></label>
        <label className="wide">Seasonal Demand Driver<input name="seasonalDemandDriver" defaultValue={initial?.seasonalDemandDriver} /></label>

        <h3>OUKITEL Business Fields</h3>
        <label>Product Category<select name="productCategory" defaultValue={initial?.productCategory ?? categories[0]}><OptionList values={categories} /></select></label>
        <label>Interested Model<select name="interestedModel" defaultValue={initial?.interestedModel ?? models[0]}><OptionList values={models} /></select></label>
        <label>Business Model<select name="businessModel" defaultValue={initial?.businessModel ?? businessModels[0]}><OptionList values={businessModels} /></select></label>
        <label>Target Market<input name="targetMarket" defaultValue={initial?.targetMarket} /></label>
        <label>Estimated Quantity<input name="estimatedQuantity" defaultValue={initial?.estimatedQuantity} /></label>
        <label>Plug Type<input name="plugType" defaultValue={initial?.plugType} /></label>
        <label>Certification Requirement<input name="certificationRequirement" defaultValue={initial?.certificationRequirement} /></label>
        <label>OEM/ODM Requirement<input name="oemOdmRequirement" defaultValue={initial?.oemOdmRequirement} /></label>

        <h3>Sales Forecast</h3>
        <label>Contact Method<select name="contactMethod" defaultValue={initial?.lastContactMethod ?? methods[0]}><OptionList values={methods} /></select></label>
        <label>Contact Date<input required name="contactDate" type="date" defaultValue={initial?.lastContactDate ?? today} /></label>
        <label>Contact Time<input required name="contactTime" type="time" defaultValue={initial?.lastContactTime ?? "10:00"} /></label>
        <label>Next Action<select name="nextAction" defaultValue={initial?.nextAction ?? nextActions[0]}><OptionList values={nextActions} /></select></label>
        <label>Estimated Order Value<input name="estimatedOrderValue" type="number" min="0" defaultValue={String(initial?.estimatedOrderValue ?? 50000)} /></label>
        <label>Probability<select name="probability" defaultValue={String(initial?.probability ?? 10)}><OptionList values={probabilities} /></select></label>
        <label>Expected Close Date<input name="expectedCloseDate" type="date" defaultValue={initial?.expectedCloseDate ?? today} /></label>
        <label>Payment Status<select name="paymentStatus" defaultValue={initial?.paymentStatus ?? payments[0]}><OptionList values={payments} /></select></label>
        <label>Risk Level<select name="riskLevel" defaultValue={initial?.riskLevel ?? risks[0]}><OptionList values={risks} /></select></label>
        <label>Main Blocker<select name="mainBlocker" defaultValue={initial?.mainBlocker ?? blockers[0]}><OptionList values={blockers} /></select></label>
        <label>Need Boss Support<select name="needBossSupport" defaultValue={initial?.needBossSupport ?? "No"}><OptionList values={["No", "Yes"]} /></select></label>
        <label>Need Team Support<input name="needTeamSupport" defaultValue={initial?.needTeamSupport} /></label>
        <label className="wide">Follow-up Content<textarea required name="followUpContent" defaultValue={initial?.followUpContent} /></label>
        <label className="wide">Customer Reply<textarea name="customerReply" defaultValue={initial?.customerReply} /></label>
        <label className="wide">Forecast Notes<textarea name="forecastNotes" defaultValue={initial?.forecastNotes} /></label>
        <label className="wide">Notes<textarea name="notes" defaultValue={initial?.notes} /></label>
      </div>
      <div className="form-actions sticky-actions"><button className="button" type="button" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">{submitLabel}</button></div>
    </form>
  );
}

function TemplatePicker({ records, type, onCopy }: { records: FollowUpRecord[]; type: "email" | "whatsapp"; onCopy: (value: string) => void }) {
  const [id, setId] = useState(records[0]?.id ?? "");
  const record = records.find((item) => item.id === id) ?? records[0];
  if (!record) return <p>No records available.</p>;
  const email = emailTemplate(record.currentStage, record.replyStatus, record.customerName, record.mainBlocker);
  const text = type === "email" ? `Subject: ${email.subject}\n\n${email.body}` : whatsappTemplate(record);

  return (
    <div className="template-generator">
      <label>Customer<select value={id} onChange={(event) => setId(event.target.value)}>{records.map((item) => <option value={item.id} key={item.id}>{item.customerName} | {item.company}</option>)}</select></label>
      {type === "email" ? <h3>{email.subject}</h3> : null}
      <pre>{type === "email" ? email.body : text}</pre>
      <button className="button primary" onClick={() => copy(text, onCopy)}>Copy {type === "email" ? "Email" : "Message"}</button>
    </div>
  );
}

function EmailLogForm({ records, today, initialRecordId, onSubmit, onCancel }: { records: FollowUpRecord[]; today: string; initialRecordId?: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return (
    <form className="email-log-form" onSubmit={onSubmit}>
      <div className="modal-grid">
        <label className="wide">Customer<select name="recordId" defaultValue={initialRecordId ?? records[0]?.id}>{records.map((record) => <option value={record.id} key={record.id}>{record.customerName} | {record.company}</option>)}</select></label>
        <label>Sent date<input name="sentDate" type="date" required defaultValue={today} /></label>
        <label>Reply status<select name="emailReplyStatus"><OptionList values={replies} /></select></label>
        <label className="wide">Email subject<input name="subject" required /></label>
        <label className="wide">Email summary<textarea name="summary" required /></label>
        <label className="wide">Customer reply summary<textarea name="replySummary" /></label>
      </div>
      <div className="form-actions sticky-actions"><button className="button" type="button" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">Add Email Log</button></div>
    </form>
  );
}

function FollowUpLogForm({ selected, today, onSubmit, onCancel }: { selected: FollowUpRecord; today: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return (
    <form className="email-log-form" onSubmit={onSubmit}>
      <div className="modal-grid">
        <label className="wide">Customer<input value={`${selected.customerName} | ${selected.company}`} disabled /></label>
        <label>Contact Date<input name="followUpDate" type="date" required defaultValue={today} /></label>
        <label>Contact Method<select name="followUpMethod" defaultValue={selected.lastContactMethod}><OptionList values={methods} /></select></label>
        <label>Reply Status<select name="followUpReplyStatus" defaultValue={selected.replyStatus}><OptionList values={replies} /></select></label>
        <label>Follow-up Rhythm Update<select name="followUpRhythmUpdate" defaultValue=""><option value="">Keep current rhythm</option><OptionList values={rhythms} /></select></label>
        <label>Customer Value Tier Update<select name="followUpValueTierUpdate" defaultValue=""><option value="">Keep current tier</option><OptionList values={valueTiers} /></select></label>
        <label>Next Action<select name="followUpNextAction" defaultValue={selected.nextAction}><OptionList values={nextActions} /></select></label>
        <label>Next Follow-up Date<input name="followUpNextDate" type="date" required defaultValue={selected.nextFollowUpDate} /></label>
        <label className="wide">Follow-up Summary<textarea name="followUpSummary" required defaultValue={selected.followUpSummary} /></label>
        <label className="wide">Follow-up Content<textarea name="followUpContent" required defaultValue={selected.followUpContent} /></label>
        <label className="wide">Customer Reply<textarea name="followUpReply" defaultValue={selected.customerReply} /></label>
        <label className="wide">Notes<textarea name="followUpNotes" defaultValue={selected.notes} /></label>
      </div>
      <div className="form-actions sticky-actions"><button className="button" type="button" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">Save Follow-up Log</button></div>
    </form>
  );
}

function DetailDrawer({ selected, selectedTemplate, onClose, onCopy, onEdit, onDelete, onAddFollowUp, onAddEmailLog, onOpenEmailTemplate, onOpenWhatsappTemplate }: { selected: EnrichedRecord; selectedTemplate: { subject: string; body: string }; onClose: () => void; onCopy: (value: string) => void; onEdit: () => void; onDelete: () => void; onAddFollowUp: () => void; onAddEmailLog: () => void; onOpenEmailTemplate: () => void; onOpenWhatsappTemplate: () => void }) {
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="detail-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <h2>{selected.customerName}</h2>
            <p>{selected.company} | {selected.country}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">x</button>
        </div>

        <div className="drawer-actions">
          <button className="button primary" onClick={onEdit}>Edit Customer</button>
          <button className="button" onClick={onAddFollowUp}>Add Follow-up Log</button>
          <button className="button" onClick={onAddEmailLog}>Add Manual Email Log</button>
          <button className="button danger-button" onClick={onDelete}>Delete Customer</button>
        </div>

        <section className="drawer-section">
          <h3>Customer Overview</h3>
          <div className="profile-grid">
            <span><b>Lead Temperature</b>{selected.leadTemperature}</span>
            <span><b>Customer Value Tier</b>{selected.customerValueTier}</span>
            <span><b>Strategic Customer</b>{selected.strategicCustomer}</span>
            <span><b>Annual Potential</b>{selected.annualPotential}</span>
            <span><b>Boss Decision Needed</b>{selected.bossDecisionNeeded}</span>
          </div>
        </section>

        <section className="drawer-section">
          <h3>Follow-up Control</h3>
          <div className="profile-grid">
            <span><b>Follow-up Rhythm</b>{selected.followUpRhythm}</span>
            <span><b>Reminder Status</b>{selected.reminderStatus}</span>
            <span><b>Next Follow-up</b>{selected.nextFollowUpDate || "Not set"}</span>
            <span><b>Last Contact Date</b>{selected.lastContactDate}</span>
            <span><b>Main Blocker</b>{selected.mainBlocker}</span>
            <span><b>Suggested Next Action</b>{selected.nextAction}</span>
          </div>
          <p>{selected.followUpSummary}</p>
          {selected.strategicCustomer === "Yes" && !selected.nextFollowUpDate ? <small>Strategic customer needs a next follow-up date.</small> : null}
        </section>

        <section className="drawer-section">
          <h3>Customer Evaluation Panel</h3>
          <div className="profile-grid">
            <span><b>Company Value</b>{selected.companyValue}</span>
            <span><b>Channel Strength</b>{selected.channelStrength}</span>
            <span><b>Payment Risk</b>{selected.paymentRisk}</span>
            <span><b>Decision Maker Confirmed</b>{selected.decisionMakerConfirmed}</span>
            <span><b>Current Competitor Sales</b>{selected.currentCompetitorSales || "Unknown"}</span>
            <span><b>Seasonal Demand Driver</b>{selected.seasonalDemandDriver || "Unknown"}</span>
            <span><b>Next Milestone</b>{selected.nextMilestone}</span>
            <span><b>Milestone Due Date</b>{selected.milestoneDueDate || "Not set"}</span>
          </div>
          <p><b>Why We Can Win:</b> {selected.whyWeCanWin || "Not recorded"}</p>
          <p><b>Why We May Lose:</b> {selected.whyWeMayLose || "Not recorded"}</p>
          <p><b>Boss Decision Notes:</b> {selected.bossDecisionNotes || "Not recorded"}</p>
          <p><b>Risk Control Plan:</b> {selected.riskControlPlan || "Not recorded"}</p>
          <div className="drawer-sublist">
            <b>Missing Key Questions</b>
            <ul>
              {selected.missingKeyQuestions.length ? selected.missingKeyQuestions.map((item) => <li key={item}>{item}</li>) : <li>No key qualification gaps right now.</li>}
            </ul>
          </div>
        </section>

        <section className="drawer-section">
          <h3>OUKITEL Business Fields</h3>
          <p>{selected.productCategory} | {selected.interestedModel} | {selected.businessModel}</p>
          <small>{selected.estimatedQuantity} | Plug {selected.plugType} | {selected.certificationRequirement}</small>
        </section>

        <section className="drawer-section">
          <h3>Sales Forecast Fields</h3>
          <p>{selected.paymentStatus} | Risk {selected.riskLevel} | Expected close {selected.expectedCloseDate}</p>
          <small>Value: {formatUSD(selected.estimatedOrderValue)} | Probability: {selected.probability}% | Need Boss Support: {selected.needBossSupport}</small>
        </section>

        <section className="drawer-section">
          <h3>AI Suggested Next Step</h3>
          <p>{selected.suggestion.action}</p>
          <small>{selected.suggestion.timing}</small>
        </section>

        <section className="drawer-section">
          <h3>Follow-up Timeline</h3>
          {selected.history.map((event) => (
            <article className="timeline-item" key={event.id}>
              <b>{event.date} | {event.method}</b>
              <p>{event.content}</p>
              <small>{event.reply}</small>
            </article>
          ))}
        </section>

        <section className="drawer-section">
          <h3>Manual Email Logs</h3>
          {selected.emailLogs.map((log, index) => (
            <article className="timeline-item" key={`${log.sentDate}-${index}`}>
              <b>{log.sentDate} | {log.subject}</b>
              <p>{log.summary}</p>
              <small>{log.replyStatus}: {log.replySummary}</small>
            </article>
          ))}
        </section>

        <section className="drawer-section">
          <h3>Suggested Email</h3>
          <b>{selectedTemplate.subject}</b>
          <pre>{selectedTemplate.body}</pre>
          <div className="row-actions">
            <button className="button" onClick={() => copy(`${selectedTemplate.subject}\n\n${selectedTemplate.body}`, onCopy)}>Copy Email</button>
            <button className="button" onClick={onOpenEmailTemplate}>Open Email Generator</button>
          </div>
        </section>

        <section className="drawer-section">
          <h3>Suggested WhatsApp Message</h3>
          <p>{whatsappTemplate(selected)}</p>
          <div className="row-actions">
            <button className="button" onClick={() => copy(whatsappTemplate(selected), onCopy)}>Copy Message</button>
            <button className="button" onClick={onOpenWhatsappTemplate}>Open WhatsApp Generator</button>
          </div>
        </section>
      </aside>
    </div>
  );
}

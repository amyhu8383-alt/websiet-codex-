export type Region = "China" | "North America" | "Europe" | "Middle East" | "Africa" | "Latin America" | "Caribbean" | "Southeast Asia" | "Oceania";
export type CustomerType = "OEM Brand" | "Distributor" | "Wholesaler" | "Retailer" | "Chain Store" | "Solar Installer" | "EPC Contractor" | "E-commerce Seller" | "Generator Dealer" | "Competitor Dealer" | "Other";
export type SourceChannel = "Email" | "LinkedIn" | "Alibaba" | "Website Inquiry" | "Exhibition" | "WhatsApp" | "Xiaoman CRM" | "Referral" | "Other";
export type ProductCategory = "Portable Power Station" | "Solar Generator" | "Solar Panel" | "Home Energy Storage" | "Balcony Energy Storage" | "Inverter + Battery System" | "High-power Energy Storage" | "Accessories";
export type InterestedModel = "P800E" | "P1000E Plus" | "P1500E Plus" | "P2001E Plus" | "P2001E Pro" | "P5000E Plus" | "BP5000E Pro Max" | "BP2000 Pro" | "12kW Inverter System" | "Battery Pack" | "Solar Panel" | "TBD";
export type BusinessModel = "Bulk Purchase" | "Exclusive Agent" | "Regional Distributor" | "OEM Branding" | "ODM Project" | "Dropshipping" | "Retail Chain Supply" | "Project Order" | "Government / Emergency Supply" | "TBD";
export type ContactMethod = "Email" | "WhatsApp" | "Phone Call" | "Online Meeting" | "LinkedIn Message" | "Exhibition Meeting" | "Factory Visit" | "Customer Visit";
export type CurrentStage = "New Lead" | "First Contact Sent" | "Replied" | "Product Catalog Sent" | "Quotation Sent" | "Sample Discussion" | "Negotiation" | "Meeting Scheduled" | "Factory Visit Done" | "Waiting Reply" | "Payment Pending" | "Closed Won" | "Closed Lost" | "Dormant";
export type LeadTemperature = "Hot" | "Warm" | "Cold" | "Unknown";
export type ReplyStatus = "No Reply" | "Replied" | "Interested" | "Not Interested" | "Need Price" | "Need Catalog" | "Need Meeting" | "Need Samples" | "Need OEM Details" | "Need Distributor Terms" | "Need Stock Information" | "Need Technical Confirmation";
export type PaymentStatus = "Not Started" | "Waiting Deposit" | "Deposit Paid" | "Waiting Balance" | "Paid" | "Overdue Payment" | "Not Applicable";
export type RiskLevel = "Low" | "Medium" | "High";
export type Priority = "High" | "Medium" | "Low";
export type ReminderStatus = "Overdue" | "Due Today" | "Due Tomorrow" | "Due This Week" | "Not Due Yet" | "No Date Set";

export type FollowUpRhythm = "Daily" | "Every 2-3 Days" | "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly";
export type CustomerValueTier = "A" | "B" | "C" | "D";
export type AnnualPotential = "<100K USD" | "100K-500K USD" | "500K-1M USD" | "1M+ USD" | "Unknown";
export type EvaluationLevel = "High" | "Medium" | "Low" | "Unknown";
export type ChannelStrength = "Strong" | "Medium" | "Weak" | "Unknown";
export type DecisionConfirmed = "Yes" | "No" | "Unknown";
export type OemReason = "Own brand development" | "Avoid direct competition" | "Higher margin" | "Market positioning" | "Distributor exclusivity" | "Competitor price too high" | "Other" | "Unknown";
export type PaymentRisk = "Low" | "Medium" | "High" | "Very High" | "Unknown";
export type NextMilestone = "PI confirmation" | "Sample payment" | "OEM artwork confirmation" | "Packaging confirmation" | "First order deposit" | "Factory visit" | "Online meeting" | "Shipment arrangement" | "Price approval" | "Distributor terms confirmation" | "Stock confirmation" | "Payment plan confirmation" | "Model selection" | "Other";

export interface Market {
  country: string;
  city: string;
  timeZone: string;
  region: Region;
}

export interface FollowUpEvent {
  id: string;
  date: string;
  method: ContactMethod;
  content: string;
  reply: string;
}

export interface EmailLog {
  sentDate: string;
  subject: string;
  summary: string;
  replySummary: string;
  replyStatus: ReplyStatus;
}

export interface FollowUpRecord {
  id: string;
  customerName: string;
  company: string;
  country: string;
  city: string;
  region: Region;
  timeZone: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  customerType: CustomerType;
  sourceChannel: SourceChannel;
  productCategory: ProductCategory;
  interestedModel: InterestedModel;
  businessModel: BusinessModel;
  targetMarket: string;
  estimatedQuantity: string;
  plugType: string;
  certificationRequirement: string;
  oemOdmRequirement: string;
  lastContactDate: string;
  lastContactTime: string;
  lastContactMethod: ContactMethod;
  followUpContent: string;
  customerReply: string;
  currentStage: CurrentStage;
  replyStatus: ReplyStatus;
  leadTemperature: LeadTemperature;
  followUpRhythm: FollowUpRhythm;
  customerValueTier: CustomerValueTier;
  followUpSummary: string;
  nextAction: string;
  nextFollowUpDate: string;
  notes: string;
  estimatedOrderValue: number;
  probability: number;
  expectedCloseDate: string;
  paymentStatus: PaymentStatus;
  riskLevel: RiskLevel;
  mainBlocker: string;
  needBossSupport: "Yes" | "No";
  needTeamSupport: string;
  forecastNotes: string;
  annualPotential: AnnualPotential;
  companyValue: EvaluationLevel;
  channelStrength: ChannelStrength;
  lastYearSalesRevenue: string;
  annualSalesVolume: string;
  mainSalesChannels: string;
  purchasePlan12Months: string;
  firstOrderEstimate: string;
  decisionMakerConfirmed: DecisionConfirmed;
  currentCompetitorSales: string;
  oemReason: OemReason;
  whyWeCanWin: string;
  whyWeMayLose: string;
  paymentRisk: PaymentRisk;
  riskControlPlan: string;
  bossDecisionNeeded: "Yes" | "No";
  bossDecisionNotes: string;
  nextMilestone: NextMilestone;
  milestoneDueDate: string;
  strategicCustomer: "Yes" | "No";
  seasonalDemandDriver: string;
  history: FollowUpEvent[];
  emailLogs: EmailLog[];
  customerGrade?: "A - High Priority" | "B - Medium Priority" | "C - Low Priority";
}

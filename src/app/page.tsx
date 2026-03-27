"use client";

import React, { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Users,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Circle,
  Building2,
  BrainCircuit,
  PhoneCall,
  Printer,
  Target,
  Award,
  FileText,
  Package,
  Truck,
  CreditCard,
  Recycle,
  ChevronRight,
  Lock,
  LogOut,
  X,
  Trophy,
  AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TRAINING MODULES — derived from Sales Rep Onboarding Training Deck */
/* ------------------------------------------------------------------ */

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

interface TrainingModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: string;
  lesson: string;
  bullets: string[];
  detailedContent: string[];
  quiz: QuizQuestion[];
  test?: QuizQuestion[];
}

const initialModules: TrainingModule[] = [
  {
    id: "foundation",
    title: "COS Foundation & History",
    icon: Building2,
    duration: "20 min",
    lesson:
      "Learn the COS story, what problems we solve, and how to position our value in the market.",
    bullets: [
      "Company story and market reputation",
      "Problems we solve: erratic billing, outdated equipment, poor service",
      "Why clients switch to COS",
      "Bob Fox founded the company in 1988",
    ],
    detailedContent: [
      "Mr. Bob Fox founded multiple successful companies starting in 1988, including Laser Life Inc., which was sold to Pitney Bowes in 2007.",
      "Bob Fox established one of the first companies to create a recycling concept to address toner and plastic waste associated with laser printing technology.",
      "He earned the Consumers Choice Award for six consecutive years, emphasizing customer loyalty and satisfaction.",
      "Pioneered early recycling methods to reduce toner and plastic waste in laser printing technology.",
      "Competitive drive, positive work environment, and customer happiness define his respected leadership approach.",
    ],
    quiz: [
      {
        question: "What are the top three problems COS solves?",
        options: [
          "Marketing gaps, branding, software bugs",
          "Erratic billing, outdated equipment, poor service",
          "Hiring issues, payroll, taxes",
        ],
        answer: 1,
        explanation:
          "COS solves erratic billing, outdated equipment, and poor service — the three main pain points businesses face with office technology providers.",
      },
      {
        question:
          "What best describes the COS position in the market?",
        options: [
          "Lowest-price national call center",
          "Local, responsive, relationship-driven office technology partner",
          "Retail office furniture provider",
        ],
        answer: 1,
        explanation:
          "COS is a local, responsive, relationship-driven office technology partner — not a large faceless corporation.",
      },
      {
        question: "Who founded Creative Office Solutions?",
        options: ["John Smith", "Bob Fox", "Steve Johnson"],
        answer: 1,
        explanation:
          "Mr. Bob Fox founded COS and multiple other successful companies starting in 1988.",
      },
      {
        question:
          "What award did COS earn for six consecutive years?",
        options: [
          "Best Technology Provider",
          "Consumers Choice Award",
          "Inc 500 Fastest Growing",
        ],
        answer: 1,
        explanation:
          "The Consumers Choice Award was earned for six consecutive years, emphasizing customer loyalty and satisfaction.",
      },
    ],
    test: [
      {
        question:
          "What company was Laser Life Inc. sold to in 2007?",
        options: ["Xerox", "Canon", "Pitney Bowes", "HP"],
        answer: 2,
        explanation: "Laser Life Inc. was sold to Pitney Bowes in 2007.",
      },
      {
        question:
          "What environmental innovation did Bob Fox pioneer?",
        options: [
          "Solar-powered printers",
          "Recycling methods for toner and plastic waste",
          "Paperless offices",
          "Electric delivery vehicles",
        ],
        answer: 1,
        explanation:
          "Bob Fox pioneered early recycling methods to reduce toner and plastic waste in laser printing technology.",
      },
      {
        question:
          "Which values define Bob Fox's leadership style?",
        options: [
          "Cost-cutting, efficiency, automation",
          "Competitive drive, positive work environment, customer happiness",
          "Remote work, flexible hours, unlimited PTO",
          "Aggressive sales, market domination, volume",
        ],
        answer: 1,
        explanation:
          "Competitive drive, positive work environment, and customer happiness define his leadership approach.",
      },
    ],
  },
  {
    id: "sales-flow",
    title: "The Sales Flow",
    icon: Target,
    duration: "22 min",
    lesson:
      "Prospect, connect, discover, present, close, and follow up with the right cadence.",
    bullets: [
      "Cold outreach and warm follow-up",
      "Discovery before presenting",
      "Moving naturally toward the close",
      "Follow-up discipline and timing",
    ],
    detailedContent: [
      "The COS sales flow follows a structured path: Prospect → Connect → Discover → Present → Close → Follow Up.",
      "Never skip discovery — it is the foundation of a consultative sale.",
      "Cold outreach should be purposeful: know who you are calling and why.",
      "Warm follow-ups should reference previous conversations and add value.",
      "The close is a natural result of a well-run discovery and presentation.",
    ],
    quiz: [
      {
        question: "What comes after discovery in the sales flow?",
        options: ["Prospect", "Present", "Abandon the lead"],
        answer: 1,
        explanation:
          "After discovery, you present your solution based on the pain points you uncovered.",
      },
      {
        question:
          "What happens if a rep skips discovery?",
        options: [
          "The close usually gets weaker",
          "The deal gets easier",
          "Pricing improves",
        ],
        answer: 0,
        explanation:
          "Skipping discovery means you do not understand the client's pain, making the close much weaker.",
      },
      {
        question:
          "What is the correct order of the COS sales flow?",
        options: [
          "Present → Discover → Close",
          "Prospect → Connect → Discover → Present → Close → Follow Up",
          "Close → Present → Prospect",
        ],
        answer: 1,
        explanation:
          "The full flow is: Prospect → Connect → Discover → Present → Close → Follow Up.",
      },
    ],
    test: [
      {
        question:
          "Why is cold outreach important in the COS sales process?",
        options: [
          "It lets you skip discovery",
          "It builds the initial pipeline of prospects",
          "It replaces follow-up",
          "It is not important",
        ],
        answer: 1,
        explanation:
          "Cold outreach is how you build your initial pipeline and start new conversations.",
      },
      {
        question: "What should a warm follow-up always include?",
        options: [
          "A discount offer",
          "Reference to previous conversations and added value",
          "A new product pitch",
          "An apology for the delay",
        ],
        answer: 1,
        explanation:
          "Warm follow-ups should reference previous conversations and provide additional value.",
      },
    ],
  },
  {
    id: "discovery",
    title: "Discovery Questions",
    icon: PhoneCall,
    duration: "18 min",
    lesson:
      "Uncover pain, ask better follow-up questions, and lead consultative conversations.",
    bullets: [
      "Ask what is frustrating the client",
      "Understand downtime and hidden cost",
      "Expand short answers with killer follow-ups",
      "Lead with curiosity, not pitch",
    ],
    detailedContent: [
      "Discovery is the most important part of the sales process at COS.",
      "Killer questions are consultative — they help the client realize their own pain.",
      "Ask about frustrations, downtime costs, service response times, and billing surprises.",
      "Never accept a one-word answer. Follow up with 'Tell me more about that' or 'How does that affect your team?'",
      "The goal is to make the client feel heard and understood before you ever present a solution.",
    ],
    quiz: [
      {
        question: "What is the goal of discovery?",
        options: [
          "Pitch product features quickly",
          "Find real pain points and buying reasons",
          "Rush to price",
        ],
        answer: 1,
        explanation:
          "Discovery is about finding real pain points and understanding why the client would buy.",
      },
      {
        question: "Which question uncovers pain best?",
        options: [
          "Do you need a copier?",
          "What is frustrating you about your current setup?",
          "What color machine do you prefer?",
        ],
        answer: 1,
        explanation:
          "Asking about frustrations opens up a conversation about real pain points.",
      },
      {
        question:
          "What should you do when a client gives a short answer?",
        options: [
          "Move on to the next topic",
          "Ask a follow-up like 'Tell me more about that'",
          "Start presenting your solution",
        ],
        answer: 1,
        explanation:
          "Never accept short answers — expand with follow-up questions to dig deeper.",
      },
    ],
    test: [
      {
        question:
          "Which of these is a killer consultative question?",
        options: [
          "Want to buy a copier?",
          "How much downtime do you experience monthly, and what does that cost your team?",
          "Our machines are the best, don't you agree?",
          "Can I email you a brochure?",
        ],
        answer: 1,
        explanation:
          "Killer questions help the client realize their own pain — quantifying downtime and cost is powerful.",
      },
      {
        question:
          "What should you understand about the client before presenting?",
        options: [
          "Their favorite color",
          "Their frustrations, downtime costs, and service gaps",
          "Their lunch preferences",
          "Their company stock price",
        ],
        answer: 1,
        explanation:
          "Understanding frustrations, downtime costs, and service gaps lets you present a targeted solution.",
      },
    ],
  },
  {
    id: "objections",
    title: "Handling Objections",
    icon: ShieldCheck,
    duration: "20 min",
    lesson:
      'Respond to "we\'re all set," "send me info," and budget hesitation with confidence.',
    bullets: [
      "Reframe instead of retreating",
      "Keep the conversation alive",
      "Anchor value before price",
      "Major customer objections and responses",
    ],
    detailedContent: [
      'Common objections include: "We\'re all set," "Send me info," "We\'re under contract," and "Your price is too high."',
      "When a client says 'we're all set,' ask what they like most about their current setup — this opens the door to discussing gaps.",
      "'Send me info' usually means they are brushing you off. Re-engage by asking a specific question.",
      "Always anchor value before discussing price. Show the cost of their current pain first.",
      "Reframe objections as opportunities to learn more about the client's situation.",
    ],
    quiz: [
      {
        question:
          'A client says "we\'re all set." What is the best next move?',
        options: [
          "End the conversation",
          "Ask what they like most about their current setup",
          "Discount immediately",
        ],
        answer: 1,
        explanation:
          "Asking what they like opens a discussion about gaps in their current setup.",
      },
      {
        question: '"Send me info" most often means:',
        options: [
          "They are brushing you off and need re-engagement",
          "They are ready to buy today",
          "They want service scheduled",
        ],
        answer: 0,
        explanation:
          "This is typically a brush-off. Re-engage with a specific question rather than just sending info.",
      },
      {
        question:
          "What should you do before discussing price?",
        options: [
          "Offer a discount",
          "Anchor value and show the cost of their current pain",
          "Skip to contract terms",
        ],
        answer: 1,
        explanation:
          "Always anchor value first — show them what their current problems are costing them.",
      },
    ],
    test: [
      {
        question:
          'A client says "We\'re under contract." How should you respond?',
        options: [
          "Say 'OK, goodbye'",
          "Ask when the contract expires and offer to do a comparison before renewal",
          "Tell them to break the contract",
          "Offer a massive discount",
        ],
        answer: 1,
        explanation:
          "Understanding contract timing lets you position yourself for the renewal window.",
      },
      {
        question:
          'How do you handle "Your price is too high"?',
        options: [
          "Immediately lower the price",
          "Ask what they are comparing to and reframe around total value and hidden costs",
          "Walk away from the deal",
          "Agree with them",
        ],
        answer: 1,
        explanation:
          "Understand their comparison point and reframe around total value, including hidden costs of inferior service.",
      },
    ],
  },
  {
    id: "products",
    title: "Product Knowledge",
    icon: Printer,
    duration: "25 min",
    lesson:
      "Learn the difference between printers, MFPs, and copiers, plus the Sharp lineup overview.",
    bullets: [
      "Printer vs MFP vs copier",
      "How to identify a machine quickly",
      "What goes into every copier proposal",
      "Sharp line overview",
    ],
    detailedContent: [
      "A printer prints only. An MFP (Multi-Function Printer) prints, scans, copies, and sometimes faxes. A copier is typically a larger floor-standing MFP.",
      "Identifying a machine: check the model number plate, count paper trays, and note if it has a finisher.",
      "Every copier proposal includes: the machine, service & supply agreement, delivery and installation, and training.",
      "Sharp is the primary line COS sells — know the models by segment (desktop, mid-volume, high-volume).",
      "Understanding the right machine fit is critical: desktop for small offices, mid-volume for 5-20 users, high-volume for 20+ users or print-heavy environments.",
    ],
    quiz: [
      {
        question: "What best defines an MFP?",
        options: [
          "Print only",
          "Multi-function with print, scan, copy, and sometimes fax",
          "A toner cartridge",
        ],
        answer: 1,
        explanation:
          "MFP stands for Multi-Function Printer — it combines print, scan, copy, and sometimes fax.",
      },
      {
        question: "A higher-volume client usually needs:",
        options: [
          "A desktop-only device",
          "A better-fit mid or higher-volume copier/MFP",
          "No equipment",
        ],
        answer: 1,
        explanation:
          "Higher-volume clients need machines built for their output — mid or high-volume MFPs.",
      },
      {
        question:
          "What is included in every copier proposal?",
        options: [
          "Just the machine",
          "Machine, service & supply agreement, delivery, installation, and training",
          "Only toner cartridges",
        ],
        answer: 1,
        explanation:
          "Every proposal is comprehensive: machine + service & supply + delivery + installation + training.",
      },
    ],
    test: [
      {
        question:
          "How do you identify a machine at a client site?",
        options: [
          "Ask the client to Google it",
          "Check the model number plate, count paper trays, and note finisher",
          "Guess based on the brand",
          "Take a photo and send to support later",
        ],
        answer: 1,
        explanation:
          "Check the model number plate, count paper trays, and note if it has a finisher for quick identification.",
      },
      {
        question:
          "For a small office with 3 employees, which machine type is best?",
        options: [
          "High-volume production copier",
          "Desktop MFP",
          "Industrial press",
          "No machine needed",
        ],
        answer: 1,
        explanation:
          "Small offices with few users are best served by a desktop MFP.",
      },
    ],
  },
  {
    id: "cadence",
    title: "Daily Cadence & KPIs",
    icon: BarChart3,
    duration: "15 min",
    lesson:
      "Set daily expectations around calls, activities, opportunities, and follow-up discipline.",
    bullets: [
      "50+ calls per day target",
      "How to log meaningful activity",
      "Metrics that move deals",
      "KPIs that matter for your career",
    ],
    detailedContent: [
      "The daily call target is 50+ calls per day — consistency is what builds pipeline.",
      "Every touchpoint must be logged: calls, emails, visits, demos. If it is not logged, it did not happen.",
      "Key KPIs: calls per day, appointments set, proposals sent, deals closed, revenue generated.",
      "Follow-up discipline: every prospect should be touched at least 5-7 times before moving on.",
      "Track your metrics weekly and monthly to see trends and adjust your approach.",
    ],
    quiz: [
      {
        question: "What counts as an activity?",
        options: [
          "A real client touchpoint logged correctly",
          "Thinking about a prospect",
          "An unlogged voicemail",
        ],
        answer: 0,
        explanation:
          "Only real, logged touchpoints count as activities. If it is not logged, it did not happen.",
      },
      {
        question:
          "What daily call count is the standard here?",
        options: ["10", "25", "50+"],
        answer: 2,
        explanation:
          "The standard is 50+ calls per day — consistency builds pipeline.",
      },
      {
        question:
          "How many times should you touch a prospect before moving on?",
        options: ["1-2 times", "5-7 times", "Once is enough"],
        answer: 1,
        explanation:
          "Every prospect should be touched at least 5-7 times before you consider moving on.",
      },
    ],
    test: [
      {
        question: "Which of these is a key KPI for COS reps?",
        options: [
          "Number of social media posts",
          "Appointments set and proposals sent",
          "Hours spent in the office",
          "Number of emails read",
        ],
        answer: 1,
        explanation:
          "Appointments set and proposals sent are key KPIs that directly drive revenue.",
      },
      {
        question: "Why is logging every activity important?",
        options: [
          "It is not important",
          "It creates accountability and lets managers coach effectively",
          "It slows you down",
          "It is only for new hires",
        ],
        answer: 1,
        explanation:
          "Logging creates accountability, enables coaching, and provides data to improve performance.",
      },
    ],
  },
  {
    id: "cos-offerings",
    title: "COS Offerings & Differentiators",
    icon: Package,
    duration: "18 min",
    lesson:
      "Understand what COS offers and what makes us different from competitors.",
    bullets: [
      "Full product and service lineup",
      "What makes COS different",
      "When customers come to COS",
      "Power pages and sales resources",
    ],
    detailedContent: [
      "COS offers: copiers/MFPs, printers, toner supplies, managed print services, service contracts, and document solutions.",
      "Differentiators: local service, fast response times, transparent billing, relationship-driven account management, and environmental responsibility.",
      "Customers come to COS when they are frustrated with big-box dealers, tired of billing surprises, or need faster service.",
      "Power Pages are quick-reference sheets for reps to use during calls — know where to find them and how to use them.",
      "COS also offers Auto-Supply and Auto-Restock programs, plus a Cartridge Collection recycling program.",
    ],
    quiz: [
      {
        question: "What is a key COS differentiator?",
        options: [
          "We are the cheapest option always",
          "Local service, fast response, and transparent billing",
          "We only sell online",
        ],
        answer: 1,
        explanation:
          "COS differentiates with local service, fast response times, and transparent billing.",
      },
      {
        question: "Why do customers switch to COS?",
        options: [
          "They want the cheapest machine",
          "They are frustrated with poor service, billing surprises, or slow response",
          "They need office furniture",
        ],
        answer: 1,
        explanation:
          "Customers switch because of frustrations with service quality, billing transparency, and response times.",
      },
      {
        question: "What are COS Power Pages?",
        options: [
          "Marketing brochures for clients",
          "Quick-reference sheets for reps to use during sales calls",
          "Training certificates",
        ],
        answer: 1,
        explanation:
          "Power Pages are quick-reference tools for sales reps to use during conversations with prospects.",
      },
    ],
    test: [
      {
        question: "What programs does COS offer for toner?",
        options: [
          "Only manual ordering",
          "Auto-Supply, Auto-Restock, and Cartridge Collection programs",
          "No toner programs",
          "Only OEM cartridges",
        ],
        answer: 1,
        explanation:
          "COS offers Auto-Supply, Auto-Restock, and Cartridge Collection (recycling) programs.",
      },
    ],
  },
  {
    id: "toner",
    title: "Toner Knowledge",
    icon: Recycle,
    duration: "16 min",
    lesson:
      "Learn toner basics, OEM vs compatible, MICR toner, and the COS toner advantage.",
    bullets: [
      "Toner basics and types",
      "OEM vs compatible toner",
      "What is MICR toner",
      "Why choose COS toner cartridges",
    ],
    detailedContent: [
      "Toner is a fine powder used in laser printers and copiers. It is fused to paper using heat.",
      "OEM (Original Equipment Manufacturer) toner is made by the machine manufacturer. Compatible toner is made by third parties to fit the same machines.",
      "MICR (Magnetic Ink Character Recognition) toner is specialized toner used for check printing — it contains magnetic particles that can be read by bank equipment.",
      "COS toner cartridges are high-quality compatibles that offer significant cost savings vs OEM, with comparable print quality and page yield.",
      "The Cartridge Collection Program allows clients to recycle used cartridges, supporting environmental responsibility.",
    ],
    quiz: [
      {
        question: "What is MICR toner used for?",
        options: [
          "Color photo printing",
          "Check printing with magnetic ink readable by bank equipment",
          "3D printing",
        ],
        answer: 1,
        explanation:
          "MICR toner contains magnetic particles for check printing that bank equipment can read.",
      },
      {
        question: "What is the difference between OEM and compatible toner?",
        options: [
          "There is no difference",
          "OEM is made by the machine manufacturer; compatible is made by third parties",
          "Compatible is always better quality",
        ],
        answer: 1,
        explanation:
          "OEM toner is made by the original machine manufacturer, while compatible toner is made by third parties to fit the same machines.",
      },
    ],
    test: [
      {
        question:
          "Why do clients choose COS compatible toner over OEM?",
        options: [
          "COS toner is lower quality",
          "Significant cost savings with comparable print quality and page yield",
          "COS only sells OEM",
          "There is no reason to choose COS toner",
        ],
        answer: 1,
        explanation:
          "COS compatibles offer significant cost savings vs OEM with comparable quality and yield.",
      },
      {
        question: "What is the Cartridge Collection Program?",
        options: [
          "A loyalty points program",
          "A recycling program for used toner cartridges",
          "A cartridge subscription box",
          "A trade-in program for machines",
        ],
        answer: 1,
        explanation:
          "The Cartridge Collection Program allows clients to recycle used cartridges.",
      },
    ],
  },
  {
    id: "proposals",
    title: "Proposals & Approvals",
    icon: FileText,
    duration: "20 min",
    lesson:
      "Understand copier proposals, service agreements, CPP plans, and the approval process.",
    bullets: [
      "What is included in every copier proposal",
      "Service & supply agreement details",
      "CPP Standard vs Inclusive plans",
      "Client pre-approval requirements",
    ],
    detailedContent: [
      "Every copier proposal includes: the machine, service & supply agreement, delivery and installation, and user training.",
      "Service & Supply Agreement includes all toner, parts, labor, and preventive maintenance for a fixed cost per page.",
      "CPP Option #1 (Standard Plan): covers service and parts; toner is billed separately.",
      "CPP Option #2 (Inclusive Plan): covers everything — service, parts, AND toner in one per-page rate.",
      "Client pre-approval requirements: Secretary of State check, credit application, and business verification.",
    ],
    quiz: [
      {
        question:
          "What is the difference between CPP Standard and Inclusive plans?",
        options: [
          "There is no difference",
          "Standard covers service and parts only; Inclusive covers service, parts, AND toner",
          "Inclusive is always more expensive per page",
        ],
        answer: 1,
        explanation:
          "Standard covers service and parts with toner billed separately. Inclusive bundles everything into one per-page rate.",
      },
      {
        question:
          "What is required for client pre-approval?",
        options: [
          "Just a handshake",
          "Secretary of State check, credit application, and business verification",
          "Only a phone call",
        ],
        answer: 1,
        explanation:
          "Pre-approval requires SOS check, credit application, and business verification.",
      },
    ],
    test: [
      {
        question:
          "If Secretary of State shows less than 2 years, what happens?",
        options: [
          "The deal is automatically approved",
          "Additional verification or requirements may apply",
          "Nothing changes",
          "The deal is cancelled",
        ],
        answer: 1,
        explanation:
          "Businesses with less than 2 years may require additional verification or security measures.",
      },
      {
        question: "What is the approval to delivery flow?",
        options: [
          "Ship immediately, approve later",
          "Approval → Lease → Delivery",
          "Delivery → Approval → Lease",
          "No approval needed",
        ],
        answer: 1,
        explanation:
          "The correct flow is: Approval → Lease → Delivery.",
      },
    ],
  },
  {
    id: "orders",
    title: "Sales Orders & Delivery",
    icon: Truck,
    duration: "15 min",
    lesson:
      "Learn what you need to place a sales order and the required form details.",
    bullets: [
      "What you need to place a sales order",
      "Sales order form required details",
      "Approval to lease to delivery flowchart",
      "Why COS approvals are easier",
    ],
    detailedContent: [
      "To place a sales order you need: signed agreement, approved credit, delivery address, and contact information.",
      "Sales order form requires: customer name, address, machine model, lease terms, CPP selection, and authorized signatures.",
      "The flowchart: Credit Approval → Lease Documentation → Order Processing → Delivery Scheduling → Installation → Training.",
      "COS approvals are easier because of streamlined processes, strong vendor relationships, and experienced credit teams.",
      "Always double-check all details before submitting — errors delay delivery and frustrate clients.",
    ],
    quiz: [
      {
        question:
          "What do you need to place a sales order?",
        options: [
          "Just a verbal agreement",
          "Signed agreement, approved credit, delivery address, and contact info",
          "Only an email",
        ],
        answer: 1,
        explanation:
          "A complete sales order requires a signed agreement, approved credit, delivery address, and contact information.",
      },
      {
        question: "Why are COS approvals easier?",
        options: [
          "We skip credit checks",
          "Streamlined processes, strong vendor relationships, and experienced credit teams",
          "We don't require approvals",
        ],
        answer: 1,
        explanation:
          "COS has streamlined processes and strong relationships that make the approval process smoother.",
      },
    ],
    test: [
      {
        question:
          "What happens after credit approval in the delivery flowchart?",
        options: [
          "Machine ships immediately",
          "Lease documentation is completed",
          "Training begins",
          "Nothing",
        ],
        answer: 1,
        explanation:
          "After credit approval, lease documentation must be completed before order processing.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface RepData {
  name: string;
  role: string;
  progress: number;
  score: number;
  status: string;
}

interface QuizResult {
  moduleId: string;
  type: "quiz" | "test";
  score: number;
  total: number;
  passed: boolean;
  date: string;
}

/* ------------------------------------------------------------------ */
/*  SIDEBAR                                                            */
/* ------------------------------------------------------------------ */

function Sidebar({
  current,
  setCurrent,
  onLogout,
}: {
  current: string;
  setCurrent: (v: string) => void;
  onLogout: () => void;
}) {
  const items: [string, string, React.ComponentType<{ className?: string }>][] =
    [
      ["dashboard", "Dashboard", LayoutDashboard],
      ["training", "Training", BookOpen],
      ["quizzes", "Quizzes", ClipboardCheck],
      ["tests", "Tests", Award],
      ["analytics", "Analytics", BarChart3],
      ["team", "Team", Users],
    ];

  return (
    <div className="w-full lg:w-72 bg-slate-950 text-white rounded-3xl p-5 shadow-2xl flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Creative Office Solutions
          </div>
          <div className="text-lg font-semibold">Training Portal</div>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {items.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setCurrent(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
              current === key
                ? "bg-white text-slate-950"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4 border border-white/10 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="h-4 w-4" />
          <span className="font-medium text-sm">COS AI Console</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Future feature for sales coaching, objection help, and instant answers.
        </p>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-red-500/20 transition text-sm"
      >
        <LogOut className="h-4 w-4" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN VIEW                                                         */
/* ------------------------------------------------------------------ */

function LoginView({
  onEnter,
  userName,
  setUserName,
  selectedDept,
  setSelectedDept,
}: {
  onEnter: () => void;
  userName: string;
  setUserName: (v: string) => void;
  selectedDept: string;
  setSelectedDept: (v: string) => void;
}) {
  const departments = ["Sales", "Service", "CSR", "Accounting"];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center min-h-[85vh]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 rounded-full px-4 py-1 bg-white/10 text-white hover:bg-white/10">
            Internal Onboarding + Training
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
            The COS platform that turns new hires into producers.
          </h1>
          <p className="text-slate-300 mt-5 text-lg leading-relaxed max-w-xl">
            Login-based training by department, quizzes that lock in retention,
            manager visibility, and a clean path from onboarding to performance.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-xl">
            {[
              "Sales modules + quizzes",
              "Certification tests",
              "Manager analytics",
              "Progress tracking",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[28px] border-0 shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Employee Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-12 rounded-2xl"
              />
              <Input
                placeholder="Work email"
                className="h-12 rounded-2xl"
              />
              <Input
                placeholder="Password"
                type="password"
                className="h-12 rounded-2xl"
              />
              <div className="grid grid-cols-2 gap-3">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDept === dept ? "default" : "outline"}
                    className="h-12 rounded-2xl justify-start"
                    onClick={() => setSelectedDept(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
              <Button
                onClick={onEnter}
                className="h-12 rounded-2xl w-full text-base"
                disabled={!userName.trim() || !selectedDept}
              >
                Enter Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-slate-500">
                New hire? Contact your manager for login credentials.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD                                                          */
/* ------------------------------------------------------------------ */

function DashboardHome({
  setCurrent,
  setSelectedModule,
  modules,
  moduleProgress,
  quizResults,
  userName,
}: {
  setCurrent: (v: string) => void;
  setSelectedModule: (m: TrainingModule) => void;
  modules: TrainingModule[];
  moduleProgress: Record<string, number>;
  quizResults: QuizResult[];
  userName: string;
}) {
  const overall = Math.round(
    modules.reduce((sum, m) => sum + (moduleProgress[m.id] || 0), 0) /
      modules.length
  );
  const avgQuizScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
            quizResults.length
        )
      : 0;
  const nextModule =
    modules.find((m) => (moduleProgress[m.id] || 0) < 100) || modules[0];
  const completedModules = modules.filter(
    (m) => (moduleProgress[m.id] || 0) >= 100
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6">
        <Card className="rounded-[28px] border-0 shadow-lg bg-gradient-to-br from-slate-950 to-slate-800 text-white">
          <CardContent className="p-7">
            <div className="text-sm text-slate-300 mb-2">
              Welcome back, {userName}
            </div>
            <h2 className="text-3xl font-semibold mb-3">
              Sales Rep Training Console
            </h2>
            <p className="text-slate-300 max-w-2xl mb-6">
              Build product confidence, sharpen objections, and master the COS
              sales flow from training into live conversations.
            </p>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm text-slate-300">Completion</div>
                <div className="text-2xl font-semibold mt-1">{overall}%</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm text-slate-300">Quiz Avg</div>
                <div className="text-2xl font-semibold mt-1">
                  {avgQuizScore}%
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm text-slate-300">Completed</div>
                <div className="text-2xl font-semibold mt-1">
                  {completedModules}/{modules.length}
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm text-slate-300">Tests Passed</div>
                <div className="text-2xl font-semibold mt-1">
                  {quizResults.filter((r) => r.type === "test" && r.passed).length}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-2xl"
                onClick={() => {
                  setSelectedModule(nextModule);
                  setCurrent("training");
                }}
              >
                Continue {nextModule.title}
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => setCurrent("analytics")}
              >
                Open Manager Console
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Resume training", action: "training" },
              { label: "Take a quiz", action: "quizzes" },
              { label: "Take a certification test", action: "tests" },
              { label: "View team progress", action: "team" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setCurrent(item.action)}
                className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-sm font-medium flex items-center justify-between"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {modules.slice(0, 6).map((mod) => {
          const Icon = mod.icon;
          const prog = moduleProgress[mod.id] || 0;
          return (
            <Card
              key={mod.id}
              className="rounded-[28px] border-0 shadow-lg cursor-pointer hover:-translate-y-1 transition"
              onClick={() => {
                setSelectedModule(mod);
                setCurrent("training");
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {mod.duration}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{mod.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {mod.lesson}
                </p>
                <Progress value={prog} className="h-2 mb-2" />
                <div className="text-xs text-slate-500">{prog}% complete</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TRAINING VIEW                                                      */
/* ------------------------------------------------------------------ */

function TrainingView({
  selectedModule,
  setSelectedModule,
  modules,
  moduleProgress,
  onCompleteLesson,
}: {
  selectedModule: TrainingModule;
  setSelectedModule: (m: TrainingModule) => void;
  modules: TrainingModule[];
  moduleProgress: Record<string, number>;
  onCompleteLesson: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6">
        <Card className="xl:w-80 rounded-[28px] border-0 shadow-lg shrink-0">
          <CardHeader>
            <CardTitle>Sales Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const active = selectedModule.id === mod.id;
              const prog = moduleProgress[mod.id] || 0;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full text-left p-4 rounded-2xl transition border ${
                    active
                      ? "bg-slate-950 text-white border-slate-950"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{mod.title}</span>
                    </div>
                    <span className="text-xs">{prog}%</span>
                  </div>
                  <Progress value={prog} className="h-2" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex-1">
          <Card className="rounded-[28px] border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {selectedModule.title}
                </CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {selectedModule.duration}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-slate-700 leading-relaxed text-lg">
                {selectedModule.lesson}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
                  Key Points
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedModule.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
                  Detailed Content
                </h4>
                <div className="space-y-3">
                  {selectedModule.detailedContent.map((content, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed"
                    >
                      {content}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950 text-white p-6">
                <div className="text-sm text-slate-300 mb-2">
                  Coaching Note
                </div>
                <p className="leading-relaxed text-slate-100">
                  This section is where your reps stop sounding scripted and
                  start sounding consultative. Every lesson should move them
                  closer to confidence in front of a real client.
                </p>
              </div>

              {(moduleProgress[selectedModule.id] || 0) < 100 && (
                <Button
                  className="rounded-2xl w-full h-12 text-base"
                  onClick={() => onCompleteLesson(selectedModule.id)}
                >
                  Mark Lesson Complete
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              )}
              {(moduleProgress[selectedModule.id] || 0) >= 100 && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-emerald-700 font-medium">
                  Lesson Complete
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INTERACTIVE QUIZ / TEST COMPONENT                                  */
/* ------------------------------------------------------------------ */

function InteractiveQuiz({
  title,
  questions,
  type,
  onComplete,
  onClose,
}: {
  title: string;
  questions: QuizQuestion[];
  type: "quiz" | "test";
  onComplete: (score: number, total: number) => void;
  onClose: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResult(true);
    const score = questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
      0
    );
    onComplete(score, questions.length);
  };

  const score = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
    0
  );
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 80;

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="rounded-[28px] border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div
              className={`h-20 w-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                passed ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {passed ? (
                <Trophy className="h-10 w-10 text-emerald-600" />
              ) : (
                <AlertCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-semibold mb-2">
              {passed ? "Congratulations!" : "Keep Studying"}
            </h2>
            <p className="text-slate-600 mb-6">
              {passed
                ? `You passed the ${type} with ${percentage}%!`
                : `You scored ${percentage}%. You need 80% to pass. Review the material and try again.`}
            </p>
            <div className="text-5xl font-bold mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-slate-500 mb-8">
              {percentage}% correct
            </div>

            <div className="space-y-4 text-left mb-8">
              {questions.map((q, i) => {
                const correct = answers[i] === q.answer;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-4 border ${
                      correct
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 mt-0.5 text-red-600 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{q.question}</p>
                        {!correct && (
                          <p className="text-sm text-red-600 mt-1">
                            Your answer: {q.options[answers[i]]} | Correct:{" "}
                            {q.options[q.answer]}
                          </p>
                        )}
                        {q.explanation && (
                          <p className="text-sm text-slate-600 mt-1">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={onClose} className="rounded-2xl">
              Back to {type === "quiz" ? "Quizzes" : "Tests"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  return (
    <Card className="rounded-[28px] border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <Badge variant="secondary" className="rounded-full">
            {type === "test" ? "Certification Test" : "Practice Quiz"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Progress
            value={((currentQ + 1) / questions.length) * 100}
            className="h-2 flex-1"
          />
          <span className="text-sm text-slate-500">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rounded-3xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-3">
                Question {currentQ + 1}
              </div>
              <h4 className="font-medium text-lg mb-6">{q.question}</h4>
              <div className="space-y-3">
                {q.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(currentQ, idx)}
                    className={`w-full text-left rounded-2xl p-4 border flex items-start gap-3 transition ${
                      answers[currentQ] === idx
                        ? "border-slate-950 bg-slate-50 ring-2 ring-slate-950"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    {answers[currentQ] === idx ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5 text-slate-950 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 mt-0.5 text-slate-400 shrink-0" />
                    )}
                    <span className="text-sm text-slate-700">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                  i === currentQ
                    ? "bg-slate-950 text-white"
                    : answers[i] !== undefined
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {currentQ < questions.length - 1 ? (
            <Button
              className="rounded-2xl"
              onClick={() => setCurrentQ((p) => p + 1)}
              disabled={answers[currentQ] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button
              className="rounded-2xl"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit {type === "test" ? "Test" : "Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  QUIZZES VIEW                                                       */
/* ------------------------------------------------------------------ */

function QuizzesView({
  modules,
  quizResults,
  onStartQuiz,
}: {
  modules: TrainingModule[];
  quizResults: QuizResult[];
  onStartQuiz: (mod: TrainingModule) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Practice Quizzes</h2>
        <Badge variant="secondary" className="rounded-full">
          80% to pass
        </Badge>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const results = quizResults.filter(
            (r) => r.moduleId === mod.id && r.type === "quiz"
          );
          const bestResult = results.length
            ? results.reduce((best, r) =>
                r.score / r.total > best.score / best.total ? r : best
              )
            : null;
          const bestScore = bestResult
            ? Math.round((bestResult.score / bestResult.total) * 100)
            : null;

          return (
            <Card key={mod.id} className="rounded-[28px] border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-lg">{mod.title}</h3>
                  </div>
                  <Badge className="rounded-full">
                    {mod.quiz.length} Questions
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Scenario-based review to lock in the lesson and surface where
                  coaching is needed.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {bestScore !== null ? (
                      <span
                        className={
                          bestScore >= 80 ? "text-emerald-600" : "text-amber-600"
                        }
                      >
                        Best: {bestScore}%{" "}
                        {bestScore >= 80 ? "Passed" : "Not passed"}
                      </span>
                    ) : (
                      "Not attempted"
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onStartQuiz(mod)}
                  >
                    {bestScore !== null ? "Retake Quiz" : "Start Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTS VIEW                                                         */
/* ------------------------------------------------------------------ */

function TestsView({
  modules,
  quizResults,
  moduleProgress,
  onStartTest,
}: {
  modules: TrainingModule[];
  quizResults: QuizResult[];
  moduleProgress: Record<string, number>;
  onStartTest: (mod: TrainingModule) => void;
}) {
  const modulesWithTests = modules.filter((m) => m.test && m.test.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Certification Tests</h2>
        <Badge variant="secondary" className="rounded-full">
          Complete lesson + quiz first
        </Badge>
      </div>
      <p className="text-slate-600">
        Certification tests are available after completing the lesson and passing
        the quiz for each module. Score 80% or higher to earn your certification.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        {modulesWithTests.map((mod) => {
          const Icon = mod.icon;
          const lessonDone = (moduleProgress[mod.id] || 0) >= 100;
          const quizPassed = quizResults.some(
            (r) =>
              r.moduleId === mod.id &&
              r.type === "quiz" &&
              r.passed
          );
          const canTakeTest = lessonDone && quizPassed;
          const testResults = quizResults.filter(
            (r) => r.moduleId === mod.id && r.type === "test"
          );
          const bestTest = testResults.length
            ? testResults.reduce((best, r) =>
                r.score / r.total > best.score / best.total ? r : best
              )
            : null;
          const bestScore = bestTest
            ? Math.round((bestTest.score / bestTest.total) * 100)
            : null;

          return (
            <Card key={mod.id} className="rounded-[28px] border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        canTakeTest ? "bg-emerald-100" : "bg-slate-100"
                      }`}
                    >
                      {canTakeTest ? (
                        <Icon className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Lock className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{mod.title}</h3>
                  </div>
                  <Badge className="rounded-full">
                    {mod.test!.length} Questions
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    {lessonDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300" />
                    )}
                    <span
                      className={
                        lessonDone ? "text-emerald-700" : "text-slate-500"
                      }
                    >
                      Lesson completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {quizPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300" />
                    )}
                    <span
                      className={
                        quizPassed ? "text-emerald-700" : "text-slate-500"
                      }
                    >
                      Quiz passed (80%+)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {bestScore !== null ? (
                      <span
                        className={
                          bestScore >= 80
                            ? "text-emerald-600 font-medium"
                            : "text-amber-600"
                        }
                      >
                        {bestScore >= 80
                          ? `Certified: ${bestScore}%`
                          : `Best: ${bestScore}%`}
                      </span>
                    ) : canTakeTest ? (
                      "Ready to certify"
                    ) : (
                      "Locked"
                    )}
                  </div>
                  <Button
                    variant={canTakeTest ? "default" : "outline"}
                    className="rounded-2xl"
                    disabled={!canTakeTest}
                    onClick={() => onStartTest(mod)}
                  >
                    {bestScore !== null && bestScore >= 80
                      ? "Retake"
                      : canTakeTest
                      ? "Start Test"
                      : "Locked"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ANALYTICS VIEW                                                     */
/* ------------------------------------------------------------------ */

const sampleReps: RepData[] = [
  { name: "Shyanne", role: "Sales Rep", progress: 88, score: 92, status: "Strong" },
  { name: "Alex", role: "Sales Rep", progress: 54, score: 79, status: "In Progress" },
  { name: "Jordan", role: "Sales Rep", progress: 21, score: 64, status: "Needs Coaching" },
  { name: "Taylor", role: "CSR", progress: 73, score: 85, status: "Strong" },
];

function AnalyticsView() {
  const avgProgress = Math.round(
    sampleReps.reduce((sum, rep) => sum + rep.progress, 0) / sampleReps.length
  );
  const avgScore = Math.round(
    sampleReps.reduce((sum, rep) => sum + rep.score, 0) / sampleReps.length
  );
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manager Analytics</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {[
          ["Active Learners", sampleReps.length.toString()],
          ["Avg Completion", `${avgProgress}%`],
          ["Avg Quiz Score", `${avgScore}%`],
          [
            "Needs Coaching",
            sampleReps
              .filter((r) => r.status === "Needs Coaching")
              .length.toString(),
          ],
        ].map(([label, value]) => (
          <Card key={label} className="rounded-[28px] border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="text-3xl font-semibold mt-2">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[28px] border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Team Performance Console</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Progress</th>
                  <th className="pb-3 pr-4">Quiz Score</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleReps.map((rep) => (
                  <tr key={rep.name} className="border-b last:border-b-0">
                    <td className="py-4 pr-4 font-medium">{rep.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{rep.role}</td>
                    <td className="py-4 pr-4 w-64">
                      <div className="flex items-center gap-3">
                        <Progress value={rep.progress} className="h-2" />
                        <span className="text-xs text-slate-500 w-10">
                          {rep.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{rep.score}%</td>
                    <td className="py-4 pr-4">
                      <Badge
                        variant={
                          rep.status === "Strong" ? "default" : "secondary"
                        }
                        className="rounded-full"
                      >
                        {rep.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TEAM VIEW                                                          */
/* ------------------------------------------------------------------ */

function TeamView() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      sampleReps.filter((r) =>
        `${r.name} ${r.role} ${r.status}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Team Directory</h2>
      <Card className="rounded-[28px] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employee or department"
              className="pl-10 h-12 rounded-2xl"
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((rep) => (
          <Card key={rep.name} className="rounded-[28px] border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{rep.name}</h3>
                  <p className="text-sm text-slate-500">{rep.role}</p>
                </div>
                <Badge className="rounded-full">{rep.status}</Badge>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Training Progress</span>
                    <span>{rep.progress}%</span>
                  </div>
                  <Progress value={rep.progress} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span>Quiz Average</span>
                  <span>{rep.score}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                           */
/* ------------------------------------------------------------------ */

export default function CosTrainingPortal() {
  const [entered, setEntered] = useState(false);
  const [current, setCurrent] = useState("dashboard");
  const [selectedModule, setSelectedModule] = useState<TrainingModule>(
    initialModules[0]
  );
  const [userName, setUserName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(
    {}
  );
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<{
    module: TrainingModule;
    type: "quiz" | "test";
  } | null>(null);

  const handleCompleteLesson = useCallback((moduleId: string) => {
    setModuleProgress((prev) => ({ ...prev, [moduleId]: 100 }));
  }, []);

  const handleQuizComplete = useCallback(
    (score: number, total: number) => {
      if (!activeQuiz) return;
      const result: QuizResult = {
        moduleId: activeQuiz.module.id,
        type: activeQuiz.type,
        score,
        total,
        passed: score / total >= 0.8,
        date: new Date().toLocaleDateString(),
      };
      setQuizResults((prev) => [...prev, result]);
    },
    [activeQuiz]
  );

  const handleStartQuiz = useCallback(
    (mod: TrainingModule) => {
      setActiveQuiz({ module: mod, type: "quiz" });
      setCurrent("active-quiz");
    },
    []
  );

  const handleStartTest = useCallback(
    (mod: TrainingModule) => {
      setActiveQuiz({ module: mod, type: "test" });
      setCurrent("active-quiz");
    },
    []
  );

  if (!entered)
    return (
      <LoginView
        onEnter={() => setEntered(true)}
        userName={userName}
        setUserName={setUserName}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
      />
    );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto lg:flex gap-6">
        <Sidebar
          current={current}
          setCurrent={(v) => {
            setActiveQuiz(null);
            setCurrent(v);
          }}
          onLogout={() => setEntered(false)}
        />
        <div className="flex-1 mt-6 lg:mt-0">
          {current === "dashboard" && (
            <DashboardHome
              setCurrent={setCurrent}
              setSelectedModule={setSelectedModule}
              modules={initialModules}
              moduleProgress={moduleProgress}
              quizResults={quizResults}
              userName={userName}
            />
          )}
          {current === "training" && (
            <TrainingView
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              modules={initialModules}
              moduleProgress={moduleProgress}
              onCompleteLesson={handleCompleteLesson}
            />
          )}
          {current === "quizzes" && (
            <QuizzesView
              modules={initialModules}
              quizResults={quizResults}
              onStartQuiz={handleStartQuiz}
            />
          )}
          {current === "tests" && (
            <TestsView
              modules={initialModules}
              quizResults={quizResults}
              moduleProgress={moduleProgress}
              onStartTest={handleStartTest}
            />
          )}
          {current === "active-quiz" && activeQuiz && (
            <InteractiveQuiz
              title={`${activeQuiz.module.title} ${
                activeQuiz.type === "test" ? "Certification Test" : "Quiz"
              }`}
              questions={
                activeQuiz.type === "test"
                  ? activeQuiz.module.test || []
                  : activeQuiz.module.quiz
              }
              type={activeQuiz.type}
              onComplete={handleQuizComplete}
              onClose={() => {
                setActiveQuiz(null);
                setCurrent(activeQuiz.type === "test" ? "tests" : "quizzes");
              }}
            />
          )}
          {current === "analytics" && <AnalyticsView />}
          {current === "team" && <TeamView />}
        </div>
      </div>
    </div>
  );
}

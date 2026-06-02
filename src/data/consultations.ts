import { Search, ClipboardCheck, Handshake, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ConsultationService {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  icon: LucideIcon;
  features: string[];
  popular?: boolean;
}

export const consultationServices: ConsultationService[] = [
  {
    id: "buying-advice",
    name: "Buying Advice",
    tagline: "Talk to an expert before you buy",
    price: 49,
    duration: "30 min call",
    icon: Search,
    features: [
      "Personalized vehicle shortlist",
      "Market price benchmarking",
      "Negotiation talking points",
      "Follow-up notes by email",
    ],
  },
  {
    id: "pre-purchase-inspection",
    name: "Pre-Purchase Inspection",
    tagline: "We inspect the vehicle in person",
    price: 149,
    duration: "On-site visit",
    icon: ClipboardCheck,
    popular: true,
    features: [
      "150-point mechanical inspection",
      "VIN, title, and history check",
      "Photo & video walkthrough",
      "Same-day written report",
    ],
  },
  {
    id: "selling-strategy",
    name: "Selling Strategy",
    tagline: "Sell faster and for more",
    price: 79,
    duration: "45 min call",
    icon: Handshake,
    features: [
      "Listing price recommendation",
      "Photo and copy review",
      "Buyer screening playbook",
      "Paperwork checklist",
    ],
  },
  {
    id: "maintenance-coach",
    name: "Maintenance Coach",
    tagline: "Keep your vehicle in shape",
    price: 39,
    duration: "30 min call",
    icon: Wrench,
    features: [
      "Service interval plan",
      "Trusted local mechanic referrals",
      "DIY guidance for common tasks",
      "Cost-saving recommendations",
    ],
  },
];

export const timeSlots = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "1:30 PM",
  "3:00 PM",
  "4:30 PM",
];

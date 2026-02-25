/**
 * Regulatory authority reference data.
 *
 * Provides profiles for major aviation regulatory bodies including
 * their compliance cycles, document requirements, and inspection rules.
 *
 * Usage:
 *   import { getAuthority, getAllAuthorities } from "@/lib/regulatoryAuthorities";
 *   const faa = getAuthority("FAA");
 *   console.log(faa.inspectionTypes);
 */

export type RegulatoryAuthority = {
  code: string;
  name: string;
  country: string;
  region: string;
  website: string;
  complianceCycleDays: number;
  inspectionTypes: string[];
  requiredDocuments: string[];
  reportingFrequency: string;
  certificationTypes: string[];
};

const AUTHORITIES: RegulatoryAuthority[] = [
  {
    code: "FAA",
    name: "Federal Aviation Administration",
    country: "United States",
    region: "North America",
    website: "https://www.faa.gov",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Inspection",
      "100-Hour Inspection",
      "Progressive Inspection",
      "Continuous Airworthiness",
    ],
    requiredDocuments: [
      "Airworthiness Certificate",
      "Aircraft Registration",
      "Radio Station License",
      "Weight & Balance Report",
      "Equipment List",
      "Operating Limitations",
      "Flight Manual / POH",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Standard", "Experimental", "Restricted", "Limited", "Provisional"],
  },
  {
    code: "EASA",
    name: "European Union Aviation Safety Agency",
    country: "European Union",
    region: "Europe",
    website: "https://www.easa.europa.eu",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Review of Airworthiness (ARA)",
      "Airworthiness Review Certificate (ARC)",
      "Base Maintenance Check",
      "Line Maintenance Check",
    ],
    requiredDocuments: [
      "Certificate of Airworthiness (CofA)",
      "Airworthiness Review Certificate (ARC)",
      "Aircraft Registration",
      "Noise Certificate",
      "Radio License",
      "Insurance Certificate",
      "Continuing Airworthiness Management Exposition",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Type Certificate", "Supplemental Type Certificate", "Restricted"],
  },
  {
    code: "NCAA",
    name: "Nigerian Civil Aviation Authority",
    country: "Nigeria",
    region: "Africa",
    website: "https://www.ncaa.gov.ng",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Inspection",
      "Periodic Surveillance Inspection",
      "Ramp Inspection",
      "AOC Audit",
    ],
    requiredDocuments: [
      "Certificate of Airworthiness",
      "Certificate of Registration",
      "Radio Station License",
      "Insurance Certificate",
      "Noise Certificate",
      "Flight Manual",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Standard", "Restricted", "Special Flight Permit"],
  },
  {
    code: "TCCA",
    name: "Transport Canada Civil Aviation",
    country: "Canada",
    region: "North America",
    website: "https://tc.canada.ca/en/aviation",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Inspection",
      "Progressive Inspection",
      "Manufacturer Inspection Program",
    ],
    requiredDocuments: [
      "Certificate of Airworthiness",
      "Certificate of Registration",
      "Journey Log",
      "Radio License",
      "Insurance",
      "Weight & Balance Report",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Standard", "Provisional", "Restricted", "Special"],
  },
  {
    code: "CASA",
    name: "Civil Aviation Safety Authority",
    country: "Australia",
    region: "Oceania",
    website: "https://www.casa.gov.au",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Review",
      "100 Hourly Inspection",
      "Calendar Inspection",
      "Condition Monitored",
    ],
    requiredDocuments: [
      "Certificate of Airworthiness",
      "Certificate of Registration",
      "Maintenance Release",
      "Technical Log",
      "Radio License",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Standard", "Experimental", "Restricted", "Special"],
  },
  {
    code: "DGCA",
    name: "Directorate General of Civil Aviation",
    country: "India",
    region: "Asia",
    website: "https://www.dgca.gov.in",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Inspection",
      "Mandatory Modification Inspection",
      "Certificate of Airworthiness Renewal",
      "AOC Surveillance",
    ],
    requiredDocuments: [
      "Certificate of Airworthiness",
      "Certificate of Registration",
      "Radio Telephony License",
      "Insurance Certificate",
      "Noise Certificate",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Normal", "Transport", "Restricted", "Experimental"],
  },
  {
    code: "CAAC",
    name: "Civil Aviation Administration of China",
    country: "China",
    region: "Asia",
    website: "http://www.caac.gov.cn",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Inspection",
      "Periodic Check",
      "Airworthiness Directive Compliance",
    ],
    requiredDocuments: [
      "Airworthiness Certificate",
      "Registration Certificate",
      "Radio Station License",
      "Maintenance Records",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Standard", "Restricted", "Special"],
  },
  {
    code: "UK-CAA",
    name: "UK Civil Aviation Authority",
    country: "United Kingdom",
    region: "Europe",
    website: "https://www.caa.co.uk",
    complianceCycleDays: 365,
    inspectionTypes: [
      "Annual Review of Airworthiness",
      "ARC Renewal",
      "Base Maintenance",
      "Line Maintenance",
    ],
    requiredDocuments: [
      "Certificate of Airworthiness",
      "Airworthiness Review Certificate",
      "Certificate of Registration",
      "Noise Certificate",
      "Radio License",
      "Insurance Certificate",
    ],
    reportingFrequency: "Annual",
    certificationTypes: ["Type Certificate", "Supplemental Type Certificate"],
  },
];

export function getAuthority(code: string): RegulatoryAuthority | undefined {
  return AUTHORITIES.find((a) => a.code.toUpperCase() === code.toUpperCase());
}

export function getAllAuthorities(): RegulatoryAuthority[] {
  return [...AUTHORITIES];
}

export function getAuthoritiesByRegion(region: string): RegulatoryAuthority[] {
  return AUTHORITIES.filter((a) => a.region.toLowerCase() === region.toLowerCase());
}

export function getRegions(): string[] {
  return [...new Set(AUTHORITIES.map((a) => a.region))].sort();
}

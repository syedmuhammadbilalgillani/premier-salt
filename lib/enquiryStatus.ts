// Pure constants — no DB import — so client components can use these
// without pulling lib/enquiry.ts's server-only (db) code into the browser bundle.

export const ENQUIRY_TYPES = ["quote_request", "contact", "private_label"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_TYPE_LABELS: Record<EnquiryType, string> = {
  quote_request: "Quote Request",
  contact: "Contact",
  private_label: "Private Label",
};

/** Prefix for the display reference, e.g. "RFQ-2026-0001". */
export const ENQUIRY_TYPE_PREFIX: Record<EnquiryType, string> = {
  quote_request: "RFQ",
  contact: "CT",
  private_label: "PL",
};

export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

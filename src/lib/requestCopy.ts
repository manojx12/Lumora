/** Copy for the contact / request modal, so each site can speak in its own voice. */
export interface RequestModalCopy {
  kicker: string;
  heading: string;
  projectLabel: string;
  projectPlaceholder: string;
  note: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
}

export const DEFAULT_REQUEST_COPY: RequestModalCopy = {
  kicker: 'Start a project',
  heading: "Tell us what you're building.",
  projectLabel: 'Project',
  projectPlaceholder: 'A few words about your project, timeline, and budget.',
  note: 'We reply within one business day.',
  submitLabel: 'Send request',
  successTitle: 'Request received',
  successBody: "Thanks for reaching out — we'll get back to you within one business day.",
};

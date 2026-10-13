import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Talby design tokens (v3). Zero emojis, zero em dashes.
const INK = "#0d0f13";
const SECONDARY = "#5a6170";
const FAINT = "#9aa1ae";
const BORDER = "#ececef";
const SOFT = "#f6f7f9";
const CANVAS = "#ffffff";
const ACCENT = "#1f7ae0";
const ON_ACCENT = "#ffffff";
const HEAD = "Lexend, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BODY = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";

export type TrialEmailKind = "welcome" | "reminder" | "ended";

const COPY: Record<
  TrialEmailKind,
  { subject: string; heading: string; body: string; cta: string; note: string }
> = {
  welcome: {
    subject: "Welcome to Talby. Your free trial has started.",
    heading: "Your 14 day free trial is live",
    body: "You can add deals, track payments and plan your calendar right now. No card needed.",
    cta: "Open Talby",
    note: "Your trial ends in 14 days. Subscribe for $9 a month to keep full access after that.",
  },
  reminder: {
    subject: "Your Talby trial ends in 3 days",
    heading: "3 days left in your trial",
    body: "After your trial ends, Talby becomes read-only: you can still view and export everything, but you won't be able to add or edit deals.",
    cta: "Subscribe for $9 a month",
    note: "Cancel anytime. Your data stays intact.",
  },
  ended: {
    subject: "Your Talby trial has ended",
    heading: "Your trial is over",
    body: "Talby is now read-only for your account. Everything is still here, and you can export it anytime. Subscribe to keep adding and editing deals.",
    cta: "Subscribe for $9 a month",
    note: "Cancel anytime. Your data stays intact.",
  },
};

export function TrialEmail({
  kind,
  handler,
  subscribeUrl,
  appUrl,
}: {
  kind: TrialEmailKind;
  handler: string;
  subscribeUrl: string;
  appUrl: string;
}) {
  const c = COPY[kind];
  const firstName = handler.replace(/[_-]/g, " ").split(" ")[0] || "there";

  return (
    <Html>
      <Head />
      <Preview>{c.subject}</Preview>
      <Body style={{ backgroundColor: SOFT, fontFamily: BODY, margin: 0, padding: "24px 0" }}>
        <Container style={{ backgroundColor: CANVAS, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "32px 36px", maxWidth: 560 }}>
          <Text style={{ fontSize: 15, fontWeight: 700, color: INK, fontFamily: HEAD, margin: "0 0 24px" }}>Talby</Text>
          <Heading style={{ fontSize: 22, fontWeight: 700, color: INK, fontFamily: HEAD, margin: "0 0 12px", lineHeight: 1.25 }}>
            {c.heading}{firstName !== "there" ? `, ${firstName}` : ""}
          </Heading>
          <Text style={{ fontSize: 14, color: SECONDARY, lineHeight: 1.6, margin: "0 0 20px" }}>{c.body}</Text>
          <Section style={{ margin: "24px 0" }}>
            <Link
              href={subscribeUrl}
              style={{ backgroundColor: ACCENT, color: ON_ACCENT, textDecoration: "none", padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, display: "inline-block" }}
            >
              {c.cta}
            </Link>
          </Section>
          <Text style={{ fontSize: 12, color: FAINT, lineHeight: 1.5, margin: 0 }}>{c.note}</Text>
          <Hr style={{ borderColor: BORDER, margin: "24px 0" }} />
          <Text style={{ fontSize: 12, color: FAINT, margin: 0 }}>
            <Link href={appUrl} style={{ color: FAINT }}>talby.io</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

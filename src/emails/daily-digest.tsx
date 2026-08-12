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
const CARD = "#ffffff";
const ACCENT = "#1f7ae0"; // logo lock blue (also the accent default)
const PAID = "#2f9e6f";
const DUE = "#e0a32e";
const LATE = "#f2705b";

export type DigestItem =
  | { kind: "payment"; label: string; brand: string; amount: number; status: "paid" | "due" | "late" }
  | { kind: "deliverable"; label: string; brand: string; detail?: string }
  | { kind: "post"; label: string; platform?: string }
  | { kind: "todo"; label: string; detail?: string };

type DigestPaymentStatus = Extract<DigestItem, { kind: "payment" }>["status"];

type DigestProps = {
  handler: string;
  dateLabel: string;
  summary: string;
  payments?: DigestItem[];
  deliverables?: DigestItem[];
  posts?: DigestItem[];
  todos?: DigestItem[];
  manageUrl: string;
};

function statusColor(s: DigestPaymentStatus | undefined): string {
  if (s === "paid") return PAID;
  if (s === "late") return LATE;
  if (s === "due") return DUE;
  return SECONDARY;
}

function Row({ item, index }: { item: DigestItem; index: number }) {
  const payment = item.kind === "payment" ? item : null;
  return (
    <Section
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderRadius: 12, marginBottom: 6,
        backgroundColor: index % 2 === 0 ? "#f6f7f9" : "#ffffff",
        border: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <Text style={{ margin: 0, fontSize: 14, color: INK, fontWeight: 600 }}>{item.label}</Text>
        {"brand" in item && item.brand ? (
          <Text style={{ margin: "2px 0 0", fontSize: 12, color: SECONDARY }}>{item.brand}</Text>
        ) : "detail" in item && item.detail ? (
          <Text style={{ margin: "2px 0 0", fontSize: 12, color: SECONDARY }}>{item.detail}</Text>
        ) : "platform" in item && item.platform ? (
          <Text style={{ margin: "2px 0 0", fontSize: 12, color: SECONDARY }}>{item.platform}</Text>
        ) : null}
      </div>
      {payment ? (
        <Text style={{ margin: 0, fontSize: 14, fontWeight: 700, color: statusColor(payment.status) }}>
          ${payment.amount.toLocaleString("en-US")}
        </Text>
      ) : null}
    </Section>
  );
}

function SectionBlock({ title, items }: { title: string; items: DigestItem[] }) {
  if (!items.length) return null;
  return (
    <Section style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: FAINT, margin: "0 0 8px" }}>
        {title}
      </Text>
      {items.map((it, i) => <Row key={i} item={it} index={i} />)}
    </Section>
  );
}

export function DailyDigestEmail({ handler, dateLabel, summary, payments = [], deliverables = [], posts = [], todos = [], manageUrl }: DigestProps) {
  const firstName = (handler || "there").replace(/[_-]/g, " ").split(" ")[0];
  return (
    <Html>
      <Head />
      <Preview>{summary} Here is your Talby digest.</Preview>
      <Body style={{ backgroundColor: "#f6f7f9", fontFamily: "Inter, Helvetica, Arial, sans-serif", margin: 0, padding: "24px 0" }}>
        <Container style={{ maxWidth: 520, margin: "0 auto" }}>
          {/* Header */}
          <Section style={{ textAlign: "center", padding: "0 0 16px" }}>
            <Text style={{ margin: 0, fontSize: 22, fontWeight: 800, fontFamily: "Lexend, Inter, sans-serif", color: INK, letterSpacing: "-0.01em" }}>
              Talby
            </Text>
            <Text style={{ margin: "2px 0 0", fontSize: 12, color: FAINT }}>
              {dateLabel}
            </Text>
          </Section>

          <Section style={{ backgroundColor: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 20px 8px" }}>
            <Heading style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, fontFamily: "Lexend, Inter, sans-serif", color: INK }}>
              Hi {firstName},
            </Heading>
            <Text style={{ margin: "0 0 18px", fontSize: 15, color: SECONDARY, lineHeight: "22px" }}>
              {summary}
            </Text>

            <SectionBlock title="Payments" items={payments} />
            <SectionBlock title="Deliverables" items={deliverables} />
            <SectionBlock title="Scheduled posts" items={posts} />
            <SectionBlock title="To-dos" items={todos} />

            {payments.length + deliverables.length + posts.length + todos.length === 0 && (
              <Text style={{ fontSize: 14, color: SECONDARY, margin: "0 0 12px" }}>
                Nothing scheduled for today. Enjoy the quiet.
              </Text>
            )}

            <Hr style={{ borderTop: `1px solid ${BORDER}`, margin: "20px 0 14px" }} />

            <Text style={{ margin: 0, fontSize: 12, color: FAINT, lineHeight: "18px" }}>
              You&apos;re getting this because you turned on the daily digest in Talby.
              <br />
              <Link href={manageUrl} style={{ color: ACCENT, textDecoration: "none" }}>
                Unsubscribe from the daily digest
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default DailyDigestEmail;

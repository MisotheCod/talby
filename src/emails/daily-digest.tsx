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
const BORDER_STRONG = "#e1e3e9";
const SOFT = "#f6f7f9";
const CANVAS = "#ffffff";
const ACCENT = "#1f7ae0"; // logo lock blue (also the accent default)
const ON_ACCENT = "#ffffff";
const PAID = "#2f9e6f";
const PAID_TINT = "#e4f5ec";
const DUE = "#e0a32e";
const DUE_TINT = "#fdf1d8";
const LATE = "#f2705b";
const LATE_TINT = "#fde7e2";
const HEAD = "Lexend, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BODY = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace";

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

function statusColor(s: DigestPaymentStatus): string {
  if (s === "paid") return PAID;
  if (s === "late") return LATE;
  return DUE;
}
function statusTint(s: DigestPaymentStatus): string {
  if (s === "paid") return PAID_TINT;
  if (s === "late") return LATE_TINT;
  return DUE_TINT;
}

/** Small rounded status chip. */
function StatusChip({ status, label }: { status: DigestPaymentStatus; label: string }) {
  return (
    <span
      style={{
        fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: "0.02em",
        color: statusColor(status), backgroundColor: statusTint(status),
        padding: "3px 8px", borderRadius: 999, display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function Row({ item }: { item: DigestItem }) {
  const payment = item.kind === "payment" ? item : null;
  return (
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: CANVAS, borderRadius: 12, marginBottom: 8, border: `1px solid ${BORDER}` }}>
      <tr>
        <td style={{ paddingLeft: 16, paddingTop: 11, paddingBottom: 11, verticalAlign: "middle", width: payment ? "60%" : "100%" }}>
          <Text style={{ margin: 0, fontSize: 14, fontWeight: 600, color: INK }}>{item.label}</Text>
          {"amount" in item ? (
            <Text style={{ margin: "2px 0 0", fontSize: 12, color: SECONDARY }}>{item.brand}</Text>
          ) : "detail" in item && item.detail ? (
            <Text style={{ margin: "2px 0 0", fontSize: 12, color: SECONDARY }}>{item.detail}</Text>
          ) : "platform" in item && item.platform ? (
            <Text style={{ margin: "2px 0 0", fontSize: 12, color: ACCENT }}>{item.platform}</Text>
          ) : null}
        </td>
        {payment ? (
          <td style={{ paddingRight: 16, paddingTop: 11, paddingBottom: 11, verticalAlign: "middle", textAlign: "right", width: "40%" }}>
            <Text style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: MONO, color: INK }}>
              ${payment.amount.toLocaleString("en-US")}
            </Text>
            <StatusChip status={payment.status} label={payment.status === "paid" ? "Paid" : payment.status === "late" ? "Due today" : "Expected"} />
          </td>
        ) : null}
      </tr>
    </table>
  );
}

function SectionBlock({ title, items }: { title: string; items: DigestItem[] }) {
  if (!items.length) return null;
  return (
    <Section style={{ marginBottom: 22 }}>
      <Text
        style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: FAINT, margin: "0 0 8px",
        }}
      >
        {title}
      </Text>
      {items.map((it, i) => <Row key={i} item={it} />)}
    </Section>
  );
}

function SummaryPill({ total }: { total: number }) {
  const tone = total > 3 ? DUE_TINT : SOFT;
  const label = total > 3 ? "Busy day" : "Steady day";
  return (
    <Section style={{ margin: "0 0 22px" }}>
      <table role="presentation" cellPadding="0" cellSpacing="0">
        <tr>
          <td style={{ backgroundColor: tone, borderRadius: 8, padding: "6px 12px" }}>
            <Text style={{ margin: 0, fontSize: 12, fontWeight: 600, color: total > 3 ? "#8a6d1f" : INK }}>
              {total} thing{total === 1 ? "" : "s"} today
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
}

export function DailyDigestEmail({ handler, dateLabel, summary, payments = [], deliverables = [], posts = [], todos = [], manageUrl }: DigestProps) {
  const firstName = (handler || "there").replace(/[_-]/g, " ").split(" ")[0];
  const total = payments.length + deliverables.length + posts.length + todos.length;

  return (
    <Html>
      <Head />
      <Preview>{summary}</Preview>
      <Body style={{ backgroundColor: SOFT, fontFamily: BODY, margin: 0, padding: "28px 16px" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
          {/* Header: Talby logo mark + wordmark */}
          <Section style={{ textAlign: "center", padding: "0 0 18px" }}>
            <table role="presentation" align="center" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={{ verticalAlign: "middle" }}>
                  {/* Logo mark: the brand favicon (white mark on blue, the same
                      asset served at /icon.png) */}
                  <img
                    src="https://www.talby.io/icon.png"
                    alt=""
                    width="34"
                    height="34"
                    style={{ display: "block", width: 34, height: 34, borderRadius: 9 }}
                  />
                </td>
              </tr>
            </table>
            <Text style={{ margin: "10px 0 0", fontSize: 12, color: FAINT }}>
              {dateLabel}
            </Text>
          </Section>

          {/* Main card */}
          <Section style={{ backgroundColor: CANVAS, borderRadius: 18, border: `1px solid ${BORDER}`, borderTop: `3px solid ${ACCENT}`, padding: "26px 24px 14px" }}>
            <Heading style={{ margin: "0 0 6px", fontSize: 21, fontWeight: 700, fontFamily: HEAD, color: INK, letterSpacing: "-0.01em" }}>
              Good morning, {firstName}
            </Heading>
            <Text style={{ margin: "0 0 20px", fontSize: 15, color: SECONDARY, lineHeight: "23px" }}>
              {summary}
            </Text>

            {total > 0 && <SummaryPill total={total} />}

            <SectionBlock title="Payments" items={payments} />
            <SectionBlock title="Deliverables" items={deliverables} />
            <SectionBlock title="Scheduled posts" items={posts} />
            <SectionBlock title="To-dos" items={todos} />

            {total === 0 && (
              <Section style={{ textAlign: "center", padding: "10px 0 8px" }}>
                <table role="presentation" align="center" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ backgroundColor: PAID_TINT, borderRadius: 999, padding: "8px 16px" }}>
                      <Text style={{ margin: 0, fontSize: 13, fontWeight: 600, color: PAID }}>
                        All caught up
                      </Text>
                    </td>
                  </tr>
                </table>
                <Text style={{ margin: "12px 0 0", fontSize: 14, color: SECONDARY }}>
                  Nothing scheduled for today. Enjoy the quiet and make the day yours.
                </Text>
              </Section>
            )}

            <Hr style={{ borderTop: `1px solid ${BORDER}`, margin: "22px 0 14px" }} />

            <Section style={{ paddingBottom: 4 }}>
              <Text style={{ margin: 0, fontSize: 12, color: FAINT, lineHeight: "18px" }}>
                You&apos;re getting this because you turned on the daily digest in Talby.
              </Text>
              <Text style={{ margin: "8px 0 0" }}>
                <Link href={manageUrl} style={{ color: ACCENT, textDecoration: "none", fontSize: 12, fontWeight: 500 }}>
                  Unsubscribe from the daily digest
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", padding: "18px 0 6px" }}>
            <Text style={{ margin: 0, fontSize: 11, color: FAINT }}>
              Talby · your calm command center for brand deals
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default DailyDigestEmail;
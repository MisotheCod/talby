# Security Audit Record

Baseline audit run and verified on approximately **2026-08-24** (all items tested
live, not just read from code). This records what has already been verified so
future work can tell "audited & line-item verified" from "added after this date".

## Verified status (as of the audit date)

| Area | Status | How it was verified |
|---|---|---|
| Secrets / service-role key | ✅ server-only | Grepped code + inspected built client bundles; service role key 0x in client, anon-only JWT in browser |
| Storage isolation | ✅ (fixed here) | Live cross-user download attack: `idea-files` leak found, bucket made private + owner-scoped read, re-tested (rejected) |
| Stripe webhook signature | ✅ | Forged `checkout.session.completed` w/ bad sig → HTTP 400, no upgrade |
| Paid-tier server gating | ✅ | Fresh free user, real session: assistant chat/ingest, nudges, inbox scan → 402; extract-contract → 403 |
| Deal cap | ✅ | DB-level security-definer trigger (`000007`); live test: free user's 6th active deal rejected |
| RLS coverage | ✅ | All 16 user tables have select/insert/update/delete policies scoped `auth.uid()` |
| Assistant rate limiting | ✅ | Live 18-request burst → 15×200 then 3×429 |
| Assistant ingest cap | ✅ (added here) | Rate limit 15/min + 30k-char text cap added during audit |
| Prompt injection (contract) | ✅ | Ingested malicious contract w/ false $9999 + "reveal system prompt"; assistant answered $5000, ignored injection |

## Key invariants (do not regress)

- `match_contract_chunks()` MUST bind `auth.uid()`, never a caller-supplied id
  (see `INVARIANTS` in `src/lib/assistant-ai.ts` + `000021_assistant_contracts.sql`).
- Server secrets live ONLY in `src/lib/server-config.ts` (`import "server-only"`);
  client-safe constants in `src/lib/constants.ts`. Never add a secret to the
  constants file — it ships to the browser.
- Privacy params on every OpenRouter call: `zdr:true, data_collection:deny,
  allow_fallbacks:false`. Never pass `provider.order` alongside it (404).

## Notes / accepted gaps (solo-build judgment calls)

- The LLM provider (OpenRouter/deepseek) sees a paying user's own data in-flight
  to answer them; zero-retention params requested, transparent in `/privacy`.
- Assistant rate limit is in-process (clears on redeploy) — fine for cost-abuse
  protection, not a hard per-user quota.

Anything touched after the audit date should be treated as *not yet re-audited*
for these properties.

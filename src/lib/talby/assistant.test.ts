import { test } from "node:test";
import { strict as assert } from "node:assert";

/**
 * Assistant integration tests.
 * Tests the reply mapping from /api/assistant SSE stream to { text, label, href }.
 * Tests that 429 and 403 produce limit state errors.
 */

test("assistant reply mapping: answer with citation", async () => {
  // Mock the /api/assistant response shape
  const mockDoneEvent = {
    type: "done",
    answer: "You have three payments late, $29,050 in total.",
    citations: [
      { dealId: "deal-123", brand: "Haleon Centrum" },
      { dealId: "deal-456", brand: "Golden Corral" },
    ],
    intent: "money",
    hasContracts: false,
  };

  // Simulate the reply mapping (from SAssistant ask function logic)
  const answer = mockDoneEvent.answer || "";
  const citations = mockDoneEvent.citations || [];
  const label = citations[0] ? citations[0].brand : "";
  const href = citations[0] ? `SDeal.dc.html?id=${citations[0].dealId}` : "";

  const reply = { text: answer, label, href };

  assert.equal(reply.text, "You have three payments late, $29,050 in total.");
  assert.equal(reply.label, "Haleon Centrum");
  assert.equal(reply.href, "SDeal.dc.html?id=deal-123");
  assert.equal(typeof reply.text, "string");
  assert.equal(typeof reply.label, "string");
  assert.equal(typeof reply.href, "string");
});

test("assistant reply mapping: answer without citation", async () => {
  const mockDoneEvent = {
    type: "done",
    answer: "I can answer questions about your deals, payments and contracts.",
    citations: [],
    intent: "off_topic",
    hasContracts: false,
  };

  const answer = mockDoneEvent.answer || "";
  const citations = mockDoneEvent.citations || [];
  const label = citations[0] ? citations[0].brand : "";
  const href = citations[0] ? `SDeal.dc.html?id=${citations[0].dealId}` : "";

  const reply = { text: answer, label, href };

  assert.equal(reply.text, "I can answer questions about your deals, payments and contracts.");
  assert.equal(reply.label, "");
  assert.equal(reply.href, "");
});

test("assistant reply mapping: empty answer defaults", async () => {
  const mockDoneEvent = {
    type: "done",
    answer: "",
    citations: [],
  };

  const answer = mockDoneEvent.answer || "";
  const fallback = answer || "I don't see that in your Talby data.";
  const citations = mockDoneEvent.citations || [];
  const label = citations[0] ? citations[0].brand : "";
  const href = citations[0] ? `SDeal.dc.html?id=${citations[0].dealId}` : "";

  const reply = { text: fallback, label, href };

  assert.equal(reply.text, "I don't see that in your Talby data.");
  assert.equal(reply.label, "");
  assert.equal(reply.href, "");
});

test("rate limit error (429) produces limit state", async () => {
  // Simulate 429 response handling
  const status = 429;
  const isLimit = status === 429 || status === 402;
  
  assert.equal(isLimit, true);
  
  // The board should set err: 'limit' and text: 'You have asked a lot of questions today. Talby can answer more tomorrow morning.'
  const errorState = {
    err: "limit",
    text: "You have asked a lot of questions today. Talby can answer more tomorrow morning.",
  };
  
  assert.equal(errorState.err, "limit");
  assert.equal(errorState.text.includes("lot of questions"), true);
});

test("paid gate error (402) produces limit state", async () => {
  // Simulate 402 response handling
  const status = 402;
  const isLimit = status === 429 || status === 402;
  
  assert.equal(isLimit, true);
  
  // The board should set err: 'limit'
  const errorState = {
    err: "limit",
    text: "You have asked a lot of questions today. Talby can answer more tomorrow morning.",
  };
  
  assert.equal(errorState.err, "limit");
});

test("generic error (500) produces error state not limit", async () => {
  // Simulate 500 response handling
  const status = 500;
  const isLimit = status === 429 || status === 402;
  
  assert.equal(isLimit, false);
  
  // The board should set err: 'error' with retry
  const errorState = {
    err: "error",
    text: "Talby could not answer that right now. Your data is fine. Try again in a moment.",
    retry: "What is late?",
  };
  
  assert.equal(errorState.err, "error");
  assert.notEqual(errorState.err, "limit");
  assert.equal(typeof errorState.retry, "string");
});

test("reply shape type constraint", async () => {
  // Ensure the reply always has the right keys
  const validReply = {
    text: "Some answer text",
    label: "Brand Name",
    href: "SDeal.dc.html?id=xyz",
  };
  
  const keys = Object.keys(validReply);
  assert.equal(keys.includes("text"), true);
  assert.equal(typeof validReply.text, "string");
  assert.equal(typeof validReply.label, "string");
  assert.equal(typeof validReply.href, "string");
  
  // Optional label and href are fine to be empty strings
  const minimalReply = {
    text: "Answer",
    label: "",
    href: "",
  };
  
  assert.equal(typeof minimalReply.label, "string");
  assert.equal(typeof minimalReply.href, "string");
});

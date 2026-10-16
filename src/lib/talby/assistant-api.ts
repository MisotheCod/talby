/**
 * Assistant API client for SAssistant board.
 * Fetches from /api/assistant (SSE stream) and returns { text, label, href }.
 * Throws with code='limit' on 429 (rate limit) or 402 (paid gate).
 */

export type AssistantReply = { text: string; label?: string; href?: string };

export async function askAssistant(question: string): Promise<AssistantReply> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: question }),
  });

  if (res.status === 429 || res.status === 402) {
    const err = new Error(res.status === 429 ? "rate_limit" : "paid_gate") as Error & { code: string };
    err.code = "limit";
    throw err;
  }

  if (!res.ok) {
    const err = new Error("assistant_error") as Error & { code: string };
    err.code = "error";
    throw err;
  }

  // Parse SSE stream
  const reader = res.body?.getReader();
  if (!reader) {
    const err = new Error("no_body") as Error & { code: string };
    err.code = "error";
    throw err;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
  let citations: Array<{ dealId: string; brand: string }> = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const json = JSON.parse(line.slice(6));
        
        if (json.type === "delta") {
          // Streaming chunk (we don't need to show incremental updates for the board)
          continue;
        } else if (json.type === "done") {
          answer = json.answer || "";
          citations = json.citations || [];
        } else if (json.type === "error") {
          const err = new Error(json.error || "assistant_error") as Error & { code: string };
          err.code = "error";
          throw err;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Build the reply shape { text, label, href }
  // label = first citation brand or empty, href points to first deal
  const text = answer || "I don't see that in your Talby data.";
  const label = citations[0]?.brand || "";
  const href = citations[0] ? `SDeal.dc.html?id=${citations[0].dealId}` : "";

  return { text, label, href };
}

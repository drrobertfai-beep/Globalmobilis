// Verifies the Knock request construction without real keys by mocking fetch.
const originalFetch = globalThis.fetch;
let captured = null;

globalThis.fetch = async (url, opts) => {
  captured = { url: String(url), headers: opts.headers, body: JSON.parse(opts.body) };
  return {
    ok: true,
    status: 200,
    text: async () => "{}",
  };
};

process.env.KNOCK_API_KEY = "test-key-123";
process.env.KNOCK_WORKFLOW_KEY = "my-email-flow";

const mod = await import("../src/lib/email.ts");
const sent = await mod.sendEmail({ to: "someone@example.com", subject: "Test subject", html: "<p>hi</p>" });

console.log("sendEmail returned:", sent);
console.log("captured URL:", captured.url);
console.log("auth header:", captured.headers.Authorization);
console.log("body:", JSON.stringify(captured.body, null, 2));

const b = captured.body;
const assert = (cond, msg) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("PASS:", msg);
};
assert(captured.url === "https://api.knock.app/v1/notify", "endpoint URL");
assert(captured.headers.Authorization === "Bearer test-key-123", "Bearer auth");
assert(b.name === "my-email-flow", "workflow key from env");
assert(b.recipients[0].email === "someone@example.com", "recipient email");
assert(b.data.subject === "Test subject" && b.data.html === "<p>hi</p>", "data payload");

// Restore fetch, test no-key fallback path doesn't crash
globalThis.fetch = originalFetch;
delete process.env.KNOCK_API_KEY;
const noKey = await mod.sendEmail({ to: "x@y.com", subject: "s", html: "<p>x</p>" });
console.log("no-key sendEmail returned:", noKey);
console.log("ALL MOCK TESTS PASS");

async function postWebhook(url, payload) {
  if (!url) return { skipped: true, reason: "webhook url is not set" };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Make webhook failed with ${response.status}`);
  }

  return { ok: true };
}

export function triggerHiggsfield(payload) {
  return postWebhook(process.env.MAKE_HIGGSFIELD_WEBHOOK_URL, payload);
}

export function triggerBuffer(payload) {
  return postWebhook(process.env.MAKE_BUFFER_WEBHOOK_URL, payload);
}

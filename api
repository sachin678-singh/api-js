const TELEGRAM_BOT_TOKEN = "8520460197:AAFmyqxml1lhfzFvw02DC5YdkJTlzIZJhSE";
const TELEGRAM_CHAT_ID = "8259919292";
const TG_MAX_LENGTH = 4096;

function formatLog(data) {
  const lines = [
    "ðŸ”” New Request Log",
    "",
    `ðŸ“¡ IP:     ${data.ip || "unknown"}`,
    `ðŸŒ URL:    ${data.url}`,
    `ðŸ“¬ Method: ${data.method}`,
    "",
    "ðŸ“¦ Body:",
    typeof data.body === "object"
      ? JSON.stringify(data.body, null, 2)
      : String(data.body),
  ];
  return lines.join("\n");
}

async function sendToTelegram(text) {
  // If within limit, send as plain message
  if (text.length <= TG_MAX_LENGTH) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    });
    return;
  }

  // Exceeds limit â€” send as .txt file
  const blob = new Blob([text], { type: "text/plain" });
  const form = new FormData();
  form.append("chat_id", TELEGRAM_CHAT_ID);
  form.append("document", blob, "log.txt");
  form.append("caption", "ðŸ“„ Log too long â€” sent as file");

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
    method: "POST",
    body: form,
  });
}

export default async function handler(req, res) {
  const xf = req.headers["x-forwarded-for"];
  const ip = xf ? xf.split(",")[0].trim() : null;

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  await new Promise((r) => req.on("end", r));

  let body = null;
  try {
    body = JSON.parse(raw);
  } catch {
    body = raw || null;
  }

  const logData = { ip, url: req.url, method: req.method, body };
  console.log(logData);

  if (body !== null) {
    const message = formatLog(logData);
    await sendToTelegram(message);
  }

  res.status(200).json({ ok: true });
}

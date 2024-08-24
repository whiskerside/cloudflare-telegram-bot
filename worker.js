function getAlertIcon(code) {
  function getLevel(code) {
    if (code >= 500) return "high";
    if (code >= 400) return "medium";
    return "low";
  }
  let level = getLevel(code);

  switch (level) {
    case "high":
      return "🔥";
    case "medium":
      return "🚨";
    case "low":
      return "😐";
    default:
      return "❓";
  }
}

function escapeMarkdown(text) {
  return [
    "_",
    "*",
    "[",
    "]",
    "(",
    ")",
    "~",
    "`",
    ">",
    "#",
    "+",
    "-",
    "=",
    "|",
    "{",
    "}",
    ".",
    "!",
  ].reduce(
    (acc, char) => acc.replace(new RegExp("\\" + char, "g"), "\\" + char),
    text
  );
}

function formatMessage(code, message, details) {
  const icon = getAlertIcon(code);

  let formattedMessage = `${icon} ${code} Alert ${icon}\n\n`;
  formattedMessage += `Message: ${escapeMarkdown(message)}\n\n`;

  if (details && Object.keys(details).length > 0) {
    formattedMessage += "Additional Details:\n";
    formattedMessage += "```\n" + JSON.stringify(details, null, 2) + "\n```";
  }

  return formattedMessage;
}

async function sendToTelegram(botToken, chatId, message, timeout = 10000) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Telegram API Error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Message sent successfully:", result);
    return result;
  } catch (error) {
    throw error;
  } finally {
    clearTimeout(id);
  }
}

function validatePayload(payload) {
  const { code, message, details } = payload;
  if (typeof code !== "number" || code < 100 || code >= 600) {
    throw new Error("Invalid code parameter");
  }
  if (typeof message !== "string" || message.trim() === "") {
    throw new Error("Invalid message parameter");
  }
  return { code, message, details };
}

function validateEnvironment(env) {
  if (!env.AUTH_TOKEN || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    throw new Error("Missing required environment variables");
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      validateEnvironment(env);

      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      const url = new URL(request.url);
      const token = url.searchParams.get("token");
      if (token !== env.AUTH_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }

      const payload = await request.json();
      const { code, message, details } = validatePayload(payload);

      const formattedMessage = formatMessage(code, message, details);
      console.log("Formatted message:", formattedMessage);

      ctx.waitUntil(
        sendToTelegram(
          env.TELEGRAM_BOT_TOKEN,
          env.TELEGRAM_CHAT_ID,
          formattedMessage
        )
      );

      return new Response("OK", { status: 200 });
    } catch (error) {
      return new Response(`Bad Request: ${error.message}`, { status: 400 });
    }
  },
};

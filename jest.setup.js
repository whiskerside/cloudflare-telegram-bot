const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { Miniflare } = require("miniflare");

const mf = new Miniflare({
  scriptPath: "worker.js",
  modules: true,
  bindings: {
    AUTH_TOKEN: "valid_token",
    TELEGRAM_BOT_TOKEN: "mock_bot_token",
    TELEGRAM_CHAT_ID: "mock_chat_id",
  },
});

global.mf = mf;

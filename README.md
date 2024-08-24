# Telegram Alert Bot for Cloudflare Workers

## Project Overview

This is a Cloudflare Workers application designed to receive external requests and forward alert messages to a Telegram bot. It provides a simple yet powerful way to integrate alerting functionality from various systems and send instant notifications via Telegram.

## Key Features

1. Receive external HTTP POST requests
2. Token-based request authentication
3. Message formatting based on error code levels (high, medium, low)
4. Send formatted messages to a specified Telegram group or user

## Installation and Configuration

### Prerequisites

- Cloudflare account
- Node.js and npm
- Telegram Bot Token and Chat ID

### Installation Steps

1. Clone this repository:

   ```
   git clone git@github.com:whiskerside/cloudflare-telegram-bot.git
   cd cloudflare-telegram-bot
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Configure environment variables:
   In your Cloudflare Workers settings, add the following environment variables:

   - `AUTH_TOKEN`: Token for authenticating external requests
   - `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token
   - `TELEGRAM_CHAT_ID`: Chat ID of the Telegram group or user to receive messages

4. Deploy to Cloudflare Workers:
   ```
   npx wrangler publish
   ```

## Usage

Send a POST request to your Cloudflare Worker URL with the following format:

```
POST https://your-worker.your-subdomain.workers.dev?token=your_auth_token
Content-Type: application/json

{
  "code": 500,
  "message": "Server error occurred",
  "details": {
    "error": "Internal server error",
    "stack_trace": "..."
  }
}
```

- `code`: Error code (integer)
  - 500 and above: High-level alert
  - 400-499: Medium-level alert
  - Others: Low-level alert
- `message`: Alert message
- `details`: Additional detailed information (optional)

## Development and Testing

Run tests:

```
npm test
```

Local development:

```
npx wrangler dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT License]

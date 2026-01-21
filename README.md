# AutoFi Bot

A TypeScript scaffold for building Solana trading bots, powered by Bun.

> 🔧 See also: [wreckit](https://github.com/mikehostetler/wreckit) - My companion tool for building and testing Solana bots.

## Features

- **Bun-native** - Fast runtime, native SQLite, ESM modules
- **Solana integration** - @solana/web3.js with connection pooling, wallet management, tx helpers
- **SQLite persistence** - bun:sqlite + Drizzle ORM for bot state and transaction history
- **Async generator loops** - Efficient tick-based bot architecture
- **Structured logging** - Pino with pretty-print support
- **PM2 process management** - Production-ready daemon support

## Prerequisites

- [Bun](https://bun.sh) >= 1.0

## Installation

```sh
git clone https://github.com/mikehostetler/autofi_bot.git
cd autofi_bot
bun install
```

## Configuration

Create a `.env` file:

```sh
# Required for bot operations
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_SECRET_KEY=<base58-or-json-array>

# Optional
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
COMMITMENT=confirmed
LOG_LEVEL=info
NODE_ENV=development
```

## Quick Start

```sh
# Initialize the database
bun db:migrate

# Run the example bot
bun cli hello-bot

# Check status
bun cli status
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `bun cli hello-bot` | Run the example bot |
| `bun cli status` | Show bot status and statistics |
| `bun cli help` | Display help information |

## Development Commands

| Command | Description |
|---------|-------------|
| `bun test` | Run tests |
| `bun run typecheck` | TypeScript type checking |
| `bun lint` | Run ESLint |
| `bun format` | Format code with Prettier |
| `bun db:migrate` | Run database migrations |

## PM2 Process Management

For production, use PM2 to run bots as daemons:

```sh
bun bots:start   # Start bots defined in ecosystem.config.cjs
bun bots:stop    # Stop all bots
bun bots:restart # Restart all bots
bun bots:logs    # View logs
```

Configure bots in `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [
    {
      name: 'HELLO_BOT',
      script: 'bun',
      args: ['run', 'src/index.ts', 'hello-bot'],
      max_memory_restart: '124M',
      out_file: './logs/hello_bot.log',
      error_file: './logs/hello_bot.error.log'
    }
  ]
}
```

## Project Structure

```
src/
├── bot/        # BaseBot class with async generator tick loop
├── cli/        # Commander.js CLI commands
├── db/         # SQLite database (bun:sqlite + Drizzle ORM)
├── solana/     # Solana client (connection, wallet, tx helpers)
└── util/       # Environment config, logging
```

## Building a Bot

Extend `BaseBot` and implement `onTick`:

```typescript
import { BaseBot, BotContext } from './bot'

class MyBot extends BaseBot {
  constructor() {
    super({ name: 'MyBot', tickIntervalMs: 1000 })
  }

  async onTick(ctx: BotContext): Promise<void> {
    const slot = await ctx.connection.getSlot()
    // Your bot logic here
  }
}
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `bot_state` | Key-value store for bot configuration |
| `transactions` | Transaction history with status tracking |
| `events` | Audit log for bot events |
| `token_accounts` | Tracked token accounts and balances |

## License

MIT License - Copyright (c) 2024 Mike Hostetler

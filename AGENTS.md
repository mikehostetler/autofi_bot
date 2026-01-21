# AGENTS.md

## Commands
- **Run CLI**: `bun cli <command>` or `bun run src/index.ts <command>`
- **Test all**: `bun test`
- **Test single file**: `bun test test/<filename>.test.ts`
- **Typecheck**: `bun run typecheck`
- **Lint**: `bun lint` | **Fix**: `bun lint:fix`
- **Format**: `bun format`
- **DB Migrate**: `bun db:migrate`
- **Bots (PM2)**: `bun bots:start`, `bun bots:stop`, `bun bots:logs`

## Architecture
- **Bun + TypeScript** CLI app using Commander.js (ESM, ES2022)
- **src/cli/**: CLI commands (hello_bot, status, help)
- **src/solana/**: Solana client (connection, wallet, tx helpers)
- **src/db/**: SQLite database (bun:sqlite + Drizzle ORM)
- **src/bot/**: Bot base class with async generator tick loop
- **src/util/**: Utilities (env with znv/zod, pino logger)
- **test/**: Bun tests (*.test.ts files)
- **data/**: SQLite database files (bot.sqlite)

## Code Style
- Prettier: 2-space tabs, no semicolons, single quotes, arrow parens avoid
- Strict TypeScript with ES2022 target, ESM modules
- Use znv + zod for environment variable parsing (see src/util/env.ts)
- Use pino for logging (see src/util/log.ts)
- snake_case for filenames, camelCase for variables/functions

## Environment Variables
- `SOLANA_RPC_URL` - Solana RPC endpoint (default: mainnet-beta)
- `SOLANA_WS_URL` - Optional WebSocket endpoint
- `SOLANA_SECRET_KEY` - Wallet secret key (base58 or JSON array)
- `COMMITMENT` - Transaction commitment level (default: confirmed)
- `LOG_LEVEL` - Logging level (silly/trace/debug/info/warn/error/fatal)
- `NODE_ENV` - Environment (development/production)

## Bot Development
- Extend `BaseBot` from `src/bot/base.ts`
- Implement `onTick(ctx: BotContext)` for main loop logic
- Use async generators for efficient tick loops with `Bun.sleep()`
- Database auto-initialized, access via `getDb()` from `src/db`

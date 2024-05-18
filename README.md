# AutoFi Bot

## Overview
`autofi_bot` is a command-line tool designed to automate various tasks. This project is built using TypeScript and can be extended to include multiple bots for different purposes.

## Getting Started

### Prerequisites
- Node.js (>= 14.x)
- Yarn (>= 1.x)

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/autofi_bot.git
    cd autofi_bot
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

3. Build the project:
    ```sh
    yarn build
    ```

## Usage

### Running the `hello-bot`
You can run the `hello-bot` using the CLI. The `hello-bot` prints a message and continues to do so at regular intervals.

To run the `hello-bot`, use the following command:


## CLI Commands

- `yarn cli hello-bot`: Runs the Hello Bot
- `yarn cli help`: Displays help information

## Bot Execution with PM2

To run bots long-term, use PM2. Add an entry for each bot in the `ecosystem.config.js` file:

```
javascript:ecosystem.config.js
// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      // Unique bot name
      name: 'HELLO_BOT',

      // Local command to start the bot
      script: 'yarn cli hello-bot',
      max_memory_restart: '124M',

      // Logging config

      // Env specific config
    },
    // More bots here
  ],
}

```

Then use PM2 commands to manage the bots:
- `yarn bots:start`: Starts the bots
- `yarn bots:stop`: Stops the bots
- `yarn bots:restart`: Restarts the bots
- `yarn bots:logs`: Displays bot logs

## Bun Support (Limited)

While we love Bun, please note that this project has limited support for it.  We've experienced issues with some of the older blockchain libraries we use. We recommend using Node.js for the best experience.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss the proposed changes.

## MIT License

Copyright (c) 2024 Mike Hostetler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'HELLO_BOT',
      script: 'bun',
      args: ['run', 'src/index.ts', 'hello-bot'],
      max_memory_restart: '124M',

      // Logging
      merge_logs: true,
      out_file: './logs/hello_bot.log',
      error_file: './logs/hello_bot.error.log',
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',

      // Env specific config
      env: {
        FOO: 'bar',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
}

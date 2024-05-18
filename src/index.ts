import cli from './cli'

cli.parseAsync(process.argv).catch(error => {
  console.error('[failed]', String(error))
  process.exit(1)
})

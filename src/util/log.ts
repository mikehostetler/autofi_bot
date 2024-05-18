import { Logger, type ILogObj } from 'tslog'

import { LOG_LEVEL } from './env'
import { LogLevel } from './env'

function translateLogLevel(logLevel: string | number): number {
  switch (logLevel) {
    case 'silly':
      return LogLevel.silly
    case 'debug':
      return LogLevel.debug
    case 'info':
      return LogLevel.info
    case 'warn':
      return LogLevel.warn
    case 'error':
      return LogLevel.error
    default:
      return LogLevel.info
  }
}

const logLevel = translateLogLevel(LOG_LEVEL)

// Customization options for the logger
const logSettings = {
  // name: "myProjectLogger", // Set a name for your logger
  // displayFilePath: "hidden", // Options: "hidden", "displayAll", "hideNodeModulesOnly"
  displayFunctionName: false, // Whether to display the name of the function that logged the message
  displayLoggerName: true, // Whether to display the logger's name
  displayLogLevel: true, // Whether to display the log level
  displayInstanceName: false, // Whether to display the instance name
  displayRequestId: false, // Whether to display a request ID, useful for tracing log messages in a request
  dateTimePattern: 'year-month-day hour:minute:second.millisecond', // Format of timestamp
  colorizePrettyLogs: false, // Whether to colorize messages when pretty-printing
  minLevel: logLevel, // Minimum log level
}

class ExtendedLogger extends Logger<ILogObj> {
  dir(obj: any) {
    console.dir(obj, { depth: null })
  }
}

const log: ExtendedLogger = new ExtendedLogger(logSettings)

export default log

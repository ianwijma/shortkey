import consola, { ConsolaLogObject, LogLevel } from "consola";

export type LoggingFunction = (
  msg: ConsolaLogObject | any,
  ...args: any[]
) => void;

export type LoggingObject = {
  [key in TargetLevels]: LoggingFunction;
};

export type LoggerOptions = {
  verbose: LogLevel;
};

type TargetLevels =
  | "fatal"
  | "error"
  | "warn"
  | "log"
  | "info"
  | "success"
  | "debug"
  | "trace";

let GLOBAL_LOG_LEVEL = 3;

export default function logger(
  context: string | undefined = undefined
): LoggingObject {
  const consolaLogger = consola.create({
    level: GLOBAL_LOG_LEVEL,
  });

  function createLogger(
    level: TargetLevels,
    context: string | undefined
  ): LoggingFunction {
    return function loggerFunction(
      msg: ConsolaLogObject | any,
      ...args: any[]
    ) {
      if (context) msg = `[${context}] ${msg}`;
      consolaLogger[level](msg, ...args);
    };
  }

  return {
    fatal: createLogger("fatal", context),
    error: createLogger("error", context),
    warn: createLogger("warn", context),
    log: createLogger("log", context),
    info: createLogger("info", context),
    success: createLogger("success", context),
    debug: createLogger("debug", context),
    trace: createLogger("trace", context),
  };
}

export function setupLogLevel(logLevel: LogLevel): void {
  GLOBAL_LOG_LEVEL = logLevel;
}

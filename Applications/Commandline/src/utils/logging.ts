import consola, { ConsolaLogObject, LogLevel } from "consola";

export type LoggingFunction = (
  msg: ConsolaLogObject | any,
  ...args: any[]
) => LoggingObject;

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
  context: string | undefined = undefined,
  logLevelOverride: LogLevel | null = null
): LoggingObject {
  const level = logLevelOverride ?? GLOBAL_LOG_LEVEL;
  const consolaLogger = consola.create({
    level,
  });

  function createLogger(
    targetLevel: TargetLevels,
    context: string | undefined
  ): LoggingFunction {
    return function loggerFunction(
      msg: ConsolaLogObject | any,
      ...args: any[]
    ): LoggingObject {
      if (context) msg = `[${context}] ${msg}`;
      consolaLogger[targetLevel](msg, ...args);
      return logger(context, level);
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

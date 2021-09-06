import consola, { ConsolaLogObject, LogLevel } from "consola";
import { Arguments } from "yargs";

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

export default function logger(
  context: string | undefined = undefined,
  argv: Arguments<LoggerOptions> | undefined = undefined
): LoggingObject {
  let level = argv?.verbose ?? 3;
  if (level === 0) level = 3;

  const consolaLogger = consola.create({
    level,
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

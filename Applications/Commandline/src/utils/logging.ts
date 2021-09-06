import consola, { Consola, ConsolaLogObject, LogLevel } from "consola";
import { Arguments } from "yargs";

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
  argv: Arguments<LoggerOptions>,
  context: string | undefined = undefined
) {
  const consolaLogger = consola.create({
    level: argv.verbose,
  });

  function createLogger(level: TargetLevels, context: string | undefined) {
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

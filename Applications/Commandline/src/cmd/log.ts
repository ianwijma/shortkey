import type { Arguments, CommandBuilder } from "yargs";
import logger, { LoggerOptions } from "../utils/logging";

type Options = LoggerOptions & {
  message: string;
};

export const command: string = "log <message>";
export const desc: string = "Tests the logging capabilities";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("message", { type: "string", demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
  const { message } = argv;
  const l = logger(argv);

  l.fatal(message);
  l.error(message);
  l.warn(message);
  l.log(message);
  l.info(message);
  l.success(message);
  l.debug(message);
  l.trace(message);
};

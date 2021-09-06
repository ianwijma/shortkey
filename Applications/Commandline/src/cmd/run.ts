import type { Arguments, CommandBuilder } from "yargs";
import { MethodId } from "../@types/common";
import { handleError, handleSuccess } from "../lib/common";
import { runMethod } from "../lib/method";
import logger, { LoggerOptions } from "../utils/logging";

type Options = LoggerOptions & {
  methodId: MethodId;
};

export const command: string = "run <methodId>";
export const desc: string = "Runs a method";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("methodId", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const l = logger("run", argv);
  const { methodId } = argv;

  l.debug("Received method id", methodId);

  const [err, result] = await runMethod(methodId);
  if (err) handleError(l, err);

  handleSuccess(l, result);
};

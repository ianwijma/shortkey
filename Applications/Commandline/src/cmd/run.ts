import type { Arguments, CommandBuilder } from "yargs";
import { MethodId } from "../@types";
import { handleError, handleSuccess } from "../lib/common";
import { runAction } from "../lib/action";
import logger, { LoggerOptions, setupLogLevel } from "../utils/logging";

type Options = LoggerOptions & {
  actionsId: MethodId;
};

export const command: string = "run <actionsId>";
export const desc: string = "Runs a action";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("actionsId", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  setupLogLevel(argv.verbose);
  const l = logger("run");
  const { actionsId } = argv;

  l.debug("Received action id", actionsId);

  const [err, result] = await runAction(actionsId);
  if (err) handleError(l, err);

  handleSuccess(l, result);
};

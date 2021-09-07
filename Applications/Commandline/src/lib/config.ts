import { TupleReturn } from "../@types";
import { homedir } from "os";
import path from "path";
import { CONFIG_PATH, CONFIG_PATH_ALT } from "./paths";
import { pathExists } from "fs-extra";
import {
  constructErrorObjectFromString,
  returnError,
  returnSuccess,
} from "./common";
import { ExitCodes } from "./exitCodes";

export async function locateConfigFolder(): Promise<TupleReturn<string>> {
  const home = homedir();
  const configPath = path.join(home, CONFIG_PATH);
  if (await pathExists(configPath)) return returnSuccess(configPath);

  const configPathAlt = path.join(home, CONFIG_PATH_ALT);
  if (await pathExists(configPathAlt)) return returnSuccess(configPathAlt);

  return returnError(
    constructErrorObjectFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `config folder does not exists @ ${configPath} or ${configPathAlt}`
    )
  );
}

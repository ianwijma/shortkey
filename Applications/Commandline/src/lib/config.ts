import { TupleReturn } from "../@types";
import { homedir } from "os";
import path from "path";
import { CONFIG_PATH, CONFIG_PATH_ALT } from "./paths";
import { pathExists, readFile, writeFile } from "fs-extra";
import { returnErrorFromString, returnSuccess } from "./common";
import { ExitCodes } from "./exitCodes";
import YAML from "yaml";

export async function locateConfigFolder(): Promise<TupleReturn<string>> {
  const home = homedir();
  const configPath = path.join(home, CONFIG_PATH);
  if (await pathExists(configPath)) return returnSuccess(configPath);

  const configPathAlt = path.join(home, CONFIG_PATH_ALT);
  if (await pathExists(configPathAlt)) return returnSuccess(configPathAlt);

  return returnErrorFromString(
    ExitCodes.FOLDER_NOT_FOUND,
    `config folder does not exists @ ${configPath} or ${configPathAlt}`
  );
}

export async function readConfigFile(path: string, fallback = null) {
  const contentStr = await readFile(path, "utf8");
  const content = YAML.parse(contentStr);
  return content?.data ?? fallback;
}

export async function writeConfigFile(
  path: string,
  data: object,
  version: number = 1
) {
  const content = { version, data };
  const contentStr = YAML.stringify(content);
  await writeFile(path, contentStr, "utf8");
}

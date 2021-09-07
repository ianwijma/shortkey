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
    `config folder does not found: ${configPath} or ${configPathAlt}`
  );
}

export interface ConfigContent<T> {
  data: T;
  version: number;
}

export async function readConfigFile<T>(
  targetVersion: number,
  path: string,
  fallback: T
): Promise<TupleReturn<T>> {
  const contentStr = await readFile(path, "utf8");
  const content: ConfigContent<T> = YAML.parse(contentStr);

  const { data = fallback, version } = content;
  if (targetVersion !== version) {
    return returnErrorFromString(
      ExitCodes.VERSION_MISS_MATCH,
      `Target version ${targetVersion}, does not math config version ${version}`
    );
  }

  return returnSuccess<T>(data);
}

export async function writeConfigFile<T>(
  path: string,
  data: T,
  version: number = 1
): Promise<void> {
  const content = { version, data };
  const contentStr = YAML.stringify(content);
  await writeFile(path, contentStr, "utf8");
}

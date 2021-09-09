import { TupleReturn } from "../@types";
import { homedir } from "os";
import path from "path";
import {
  ADDONS_FOLDER,
  ACTIONS_FOLDER,
  CONFIG_PATH,
  CONFIG_PATH_ALT,
} from "./paths";
import { mkdir, pathExists, readFile, writeFile } from "fs-extra";
import { returnErrorFromString, returnSuccess } from "./common";
import { ExitCodes } from "./exitCodes";
import YAML from "yaml";
import logger from "../utils/logging";
import { LogLevel } from "consola";
import inquirer from "inquirer";

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
  path: string,
  fallback: T,
  targetVersion: number
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

export async function ensureSetup(forceSetup: boolean = false): Promise<void> {
  const [locateErr] = await locateConfigFolder();
  if (locateErr) {
    const { message } = locateErr;
    logger("Attention", LogLevel.Error).error(message);
    if (!forceSetup) {
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Want to run the setup?",
        },
      ]);
      if (confirm) await runSetup();
    } else {
      await runSetup();
    }
  }
}

async function runSetup() {
  const home = homedir();
  await mkdir(path.join(home, CONFIG_PATH));
  await mkdir(path.join(home, CONFIG_PATH, ADDONS_FOLDER));
  await mkdir(path.join(home, CONFIG_PATH, ACTIONS_FOLDER));

  await writeConfigFile(path.join(home, CONFIG_PATH, `settings.yaml`), {}, 1);
}

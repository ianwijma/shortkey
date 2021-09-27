import {
  AddonName,
  AddonSettings,
  ExecuteObject,
  ImportedAddon,
  TupleReturn,
} from "../@types";
import {
  returnError,
  returnErrorFromError,
  returnErrorFromString,
  returnSuccess,
} from "./common";
import { ADDONS_FOLDER } from "./paths";
import { pathExists } from "fs-extra";
import { ExitCodes } from "./exitCodes";
import path from "path";
import { locateConfigFolder, readConfigFile } from "./config";

export async function executeAddon(
  addonName: AddonName
): Promise<TupleReturn<AddonSettings>> {
  const [configPathErr, configPath] = await locateAddonConfigFiles(addonName);
  if (configPathErr) return returnError(configPathErr);

  const [configErr, addonSettings] = await readConfigFile(configPath, {}, 1);
  if (configErr) return returnError(configErr);

  const [loadErr, addon] = await loadAddon(addonName);
  if (loadErr) return returnError(loadErr);

  const [execErr, results] = await runAddon(addon, addonSettings);
  if (execErr) return returnError(execErr);

  // TODO: handle results

  return returnSuccess(addonSettings);
}

async function runAddon(
  addon: ImportedAddon,
  addonSettings: AddonSettings
): Promise<TupleReturn<ExecuteObject>> {
  const { handle } = addon;
  if (handle) {
    try {
      await handle(addonSettings);
    } catch (err) {
      return returnErrorFromError(
        ExitCodes.METHOD_EXECUTION_ERROR,
        err as Error
      );
    }
  }
  return returnSuccess({});
}

async function locateAddonConfigFiles(
  addonName: AddonName
): Promise<TupleReturn<string>> {
  const [pathErr, actionConfigFile] = await getAddonConfigFilePath(addonName);
  if (pathErr) return returnError(pathErr);

  if (!(await pathExists(actionConfigFile)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `File does not found: ${actionConfigFile}`
    );

  return returnSuccess(actionConfigFile);
}

async function getAddonConfigFilePath(
  addonName: AddonName
): Promise<TupleReturn<string>> {
  const [locateErr, actionsFolder] = await locateAddonsFolder();
  if (locateErr) return returnError(locateErr);

  const configPath = path.join(actionsFolder, `${addonName}.yaml`);
  return returnSuccess(configPath);
}

export async function loadAddon(
  addonName: AddonName
): Promise<TupleReturn<ImportedAddon>> {
  const [locateErr, addonFile] = await locateAddon(addonName);
  if (locateErr) return returnError(locateErr);

  const addon: ImportedAddon = await import(addonFile);
  return returnSuccess(addon);
}

export async function locateAddon(
  addonName: AddonName
): Promise<TupleReturn<string>> {
  const [err, addonFolder] = await locateAddonFolder(addonName);
  if (err) return returnError(err);

  const addon = path.join(addonFolder, "index.js");
  if (!(await pathExists(addon)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `file not found: ${addon}`
    );

  return returnSuccess(addon);
}

export async function locateAddonFolder(
  addonName: AddonName
): Promise<TupleReturn<string>> {
  const [err, addonsFolder] = await locateAddonsFolder();
  if (err) return returnError(err);

  const addonFolder = path.join(addonsFolder, addonName);
  if (!(await pathExists(addonFolder)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `Addon does not found: ${addonFolder}`
    );

  return returnSuccess(addonFolder);
}

export async function locateAddonsFolder(): Promise<TupleReturn<string>> {
  const [err, configFolder] = await locateConfigFolder();
  if (err) return returnError(err);

  const addonsFolder = path.join(configFolder, ADDONS_FOLDER);
  if (!(await pathExists(addonsFolder)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `Addons folder does not found: ${addonsFolder}`
    );

  return returnSuccess(addonsFolder);
}

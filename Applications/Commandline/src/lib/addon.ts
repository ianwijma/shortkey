import { AddonName, TupleReturn } from "../@types";
import { returnError, returnErrorFromString, returnSuccess } from "./common";
import { ADDON_FOLDER as ADDONS_FOLDER } from "./paths";
import { pathExists } from "fs-extra";
import { ExitCodes } from "./exitCodes";
import path from "path";
import { locateConfigFolder } from "./config";

export async function locateAddon(
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

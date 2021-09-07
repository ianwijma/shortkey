import { AddonConfig, TupleReturn } from "../@types";
import { returnError, returnErrorFromString, returnSuccess } from "./common";
import { ADDON_FOLDER } from "./paths";
import { pathExists } from "fs-extra";
import { ExitCodes } from "./exitCodes";
import path from "path";
import { locateConfigFolder } from "./config";

export async function loadAddons(): Promise<TupleReturn<AddonConfig>> {
  const [folderErr, addonFolder] = await locateAddonFolder();

  const add: AddonConfig = {
    addons: [],
  };
  return returnSuccess(add);
}

export async function locateAddonFolder(): Promise<TupleReturn<string>> {
  const [err, configFolder] = await locateConfigFolder();
  if (err) return returnError(err);

  const addonFolder = path.join(configFolder, ADDON_FOLDER);
  if (!(await pathExists(addonFolder)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `Addon folder does not exists @ ${addonFolder}`
    );

  return returnSuccess(addonFolder);
}
